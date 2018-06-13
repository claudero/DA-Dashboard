/*global module, Buffer, __dirname, process*/
'use strict';

const async = require('async');
const fs = require('fs');
const ForgeSDK = require('forge-apis');
const path = require('path');
const recursive = require("recursive-readdir");

/**
 * Gets a Forge oAuth2 client with read and write scopes on data
 * @param clientID
 * @param clientSecret
 * @param callback
 */
function getOAuth2Client(clientID, clientSecret, callback) {
    try {
        const oAuth2Client = new ForgeSDK.AuthClientTwoLegged(clientID, clientSecret, [
            'data:read',
            'data:write',
            'bucket:read',
            'bucket:create'
        ], false);
        callback(null, oAuth2Client);
    } catch (err) {
        console.error('Error while getting oAuth2 two-legged');
        callback(err);
    }

}

function createBucket(bucketName, oAuth2TwoLegged, token, callback) {
    const BucketsAPI = new ForgeSDK.BucketsApi();
    const bucketExists = 'bucketExists';

    async.waterfall([
        (next) => {
            BucketsAPI.getBucketDetails(bucketName, oAuth2TwoLegged, token).then(
                () => {
                    next(bucketExists);
                },
                (err) => {
                    if (err.statusCode === 404) {
                        // Go to next step to create the bucket
                        return next();
                    }
                    next(err);
                });
        },
        (next) => {
            const payload = {
                bucketKey: bucketName,
                policyKey: 'transient'
            };
            BucketsAPI.createBucket(payload, {}, oAuth2TwoLegged, token).then(
                () => {
                    next();
                }, next);
        }
    ], (err) => {
        if (err === bucketExists) {
            return callback();
        }
        callback(err);
    });

}

/**
 * Gets a token ffrom Forge
 * @param oAuth2TwoLegged
 * @param callback
 */
function getToken(oAuth2TwoLegged, callback) {
    oAuth2TwoLegged.authenticate().then(
        (credentials) => {
            callback(null, credentials);
        }, callback);
}

/**
 * Uploads the file in the OSS bucket
 * @param file
 * @param fileName
 * @param bucket
 * @param oAuth2TwoLegged
 * @param token
 * @param callback
 */
function uploadFile(file, fileName, bucket, oAuth2TwoLegged, token, callback) {
    const ObjectAPI = new ForgeSDK.ObjectsApi();

    async.waterfall([
        (next) => {
            fs.readFile(file, next);
        },
        (data, next) => {
            console.log(bucket);
            console.log(fileName);
            ObjectAPI.uploadObject(bucket, fileName, data.length, data, {}, oAuth2TwoLegged, token)
                .then((objectDetails) => {
                    next(null, objectDetails);
                }, next);
        }
    ], (err, objectDetails) => {
        if (err) {
            return callback(err);
        }
        console.log('Upload done for', fileName);
        console.log('Object ID', objectDetails.body.objectId);
        console.log('Location', objectDetails.body.location);
        callback(null, objectDetails.body.objectId);
    });
}



/**
 * Primary function. Takes a local file and uploads it to the bucket
 * @param files         {String}    List of files to translate
 * @param bucket        {String}    OSS bucket owned by the client
 * @param clientId      {String}    Forge client ID
 * @param clientSecret  {String}    Forge client secret
 * @param environment   {String}    Forge environment to use. Defaults to prod. Options: dev, stg, prd
 * @param callback      {Function}
 */
function uploadFilesToOss(files, bucket, clientId, clientSecret, environment, callback) {
    if (environment) {
        ForgeSDK.setEnvironment(environment);
    }
    if (!callback) {
        callback = () => {};
    }

    let oAuth2TwoLegged;
    let token;

    async.waterfall([
        (next) => {
            getOAuth2Client(clientId, clientSecret, (err, oAuth2) => {
                oAuth2TwoLegged = oAuth2;
                next(err);
            });
        },
        (next) => {
            getToken(oAuth2TwoLegged, (err, tok) => {
                token = tok;
                next(err);
            });
        },
        (next) => {
            createBucket(bucket, oAuth2TwoLegged, token, next);
        },
        function uploadEveryFile(next) {
            const filesInError = [];
            const urnOfFileThatTranslated = [];
            async.eachLimit(files,5, (filePath, eachCb) => {
                const fileName = path.basename(filePath);
                uploadFile(filePath, fileName, bucket, oAuth2TwoLegged, token, (err, id) => {
                    const fileName = path.basename(filePath);
                    if (err) {
                        console.error('Error while processing the file', fileName);
                        console.error('The error is', err);
                        filesInError.push(fileName);
                    }
                    if (id) {
                        console.log('\nFile upload finished:', id);
                    }
                    eachCb();
                });
            }, (err) => {
                if (err) {
                    return next(err);
                }
                if (urnOfFileThatTranslated.length > 0) {
                    let env;
                    switch (environment) {
                        case 'dev': env = 'AutodeskDevelopment'; break;
                        case 'stg': env = 'AutodeskStaging'; break;
                        default: env = 'AutodeskProduction';
                    }
                    console.log('\n===========================================================');
                    console.log('All of the translation finished. Here are the results');
                    console.log('Go to one of those links to see an svf file in a viewer (you need to have a local Firefly viewer running):');
                    urnOfFileThatTranslated.forEach(urn => {
                        console.log(`\nhttp://localhost.autodesk.com:8000/index.html?env=${env}&document=urn:${urn}&accessToken=${token.access_token}`);
                    });
                }
                if (filesInError.length > 0) {
                    console.warn('Some files failed:', filesInError);
                }
                next();
            });
        }
    ], (err) => {
        if (err) {
            console.error('Error during process:', err);
            callback(err);
        }
        console.log('Translation(s) complete!');
        callback();
    });
}

function readDirAndCUpload(directoryToRead, bucket, clientId, clientSecret, downloadResult, environment, callback) {
    async.waterfall([
        function checkIfDirectoryAndListAllFiles(next) {
            fs.lstat(directoryToRead, (err, stats) => {
                if(err) {
                    return next(err);
                }
                if (stats.isFile()) {
                    return next (null, [directoryToRead]);
                }
                if (stats.isDirectory()) {
                    return recursive(directoryToRead, (err, files) => {
                        if (err) {
                            console.error('Failed reading the directory', directoryToRead, err);
                            process.exit(1);
                        }
                        next(null, files);
                    });
                }
                console.error('File path is not a directory or a file');
                process.exit(1);
            });
        }
    ], (err, files) => {
        if (err) {
            console.error('Error while checking filepath', err);
            return;
        }
        uploadFilesToOss(files, bucket, clientId, clientSecret, downloadResult, environment, callback);
    });
}

// Check if command line
if (require.main === module) {
    // Called from command-line
    const commander = require('commander-plus');
    commander
        .description('Converts on or more max files to SVF')
        .option('-f, --filePath <filePath>', 'Absolute path to a max file or a folder containing one or more max files')
        .option('-b, --bucket <bucket>', 'Bucket to use. It will be created if it does\'t exist')
        .option('-i, --clientId <clientId>', 'Forge client ID')
        .option('-s, --clientSecret <clientSecret>', 'Forge client Secret')
        .option('-e, --environment <environment>', 'Forge environment if you wnat other that Prod. Options; dev or stg')
        //.option('-d, --download', 'If set, will download the results')
        .parse(process.argv);

    if (!commander.filePath) {
        console.error('Missing filePath argument (-f)');
        process.exit();
    }
    if (!commander.bucket) {
        console.error('Missing bucket argument (-b)');
        process.exit();
    }
    if (!commander.clientId) {
        if(process.env.FORGE_CLIENT_ID) {
            commander.clientId = process.env.FORGE_CLIENT_ID;
        } else {
            console.error('Missing clientId argument (-i)');
            process.exit();
        }
    }
    if (!commander.clientSecret) {
        if(process.env.FORGE_CLIENT_SECRET) {
            commander.clientSecret = process.env.FORGE_CLIENT_SECRET;
        } else {
            console.error('Missing clientSecret argument (-s)');
            process.exit();
        }
    }
    readDirAndCUpload(commander.filePath, commander.bucket, commander.clientId, commander.clientSecret, commander.environment, (err) => {
            if (err) {
                process.exit(1);
            }
            process.exit();
        });
}
