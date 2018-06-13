/*global module, Buffer, __dirname, process*/
'use strict';

const async = require('async');
const ForgeSDK = require('forge-apis');

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


function getBucketObjects(bucket, oAuth2TwoLegged, token, callback) {
    const BucketsAPI = new ForgeSDK.BucketsApi();
    const ObjectsAPI = new ForgeSDK.ObjectsApi();
    const noerror = 'noerror';

    async.waterfall([
        (next) => {
            BucketsAPI.getBucketDetails(bucket, oAuth2TwoLegged, token).then(
                () => {
                    next();
                },
                (err) => {
                    console.log("Bucket does not exist");
                    if (err.statusCode === 404) {
                        // Go to next step to create the bucket
                        return next();
                    }
                    next(err);
                });
        },
        (next) => {
            ObjectsAPI.getObjects(bucket, {limit : 100}, oAuth2TwoLegged, token).then(
                (response) => {
                    console.log("objects:");
                    console.log(response.body);
                    next(noerror);
                },
                (err) => {
                    if (err.statusCode === 404) {
                        console.log("Could not fetch bucket objects");
                        // Go to next step to create the bucket
                        return next();
                    }
                    next(err);
                });
        }
    ], (err) => {
        if (err === noerror) {
            return callback();
        }
        callback(err);
    });

}

/**
 * Primary function. Takes credentials and lists buckets
 * @param bucket        {String}    Bucket naame
 * @param clientId      {String}    Forge client ID
 * @param clientSecret  {String}    Forge client secret
 * @param environment   {String}    Forge environment to use. Defaults to prod. Options: dev, stg, prd
 * @param callback      {Function}
 */
function listObjects(bucket, clientId, clientSecret, environment, callback) {
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
            getBucketObjects(bucket, oAuth2TwoLegged, token, next);
        }
    ], (err) => {
        if (err) {
            console.error('Error during process:', err);
            callback(err);
        }
        callback();
    });
}


// Check if command line
if (require.main === module) {
    // Called from command-line
    const commander = require('commander-plus');
    commander
        .description('Converts on or more max files to SVF')
        .option('-b, --bucket <bucket>', 'Bucket to list')
        .option('-i, --clientId <clientId>', 'Forge client ID')
        .option('-s, --clientSecret <clientSecret>', 'Forge client Secret')
        .option('-e, --environment <environment>', 'Forge environment if you wnat other that Prod. Options; dev or stg')
        //.option('-d, --download', 'If set, will download the results')
        .parse(process.argv);

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
    listObjects(commander.bucket, commander.clientId, commander.clientSecret, commander.environment, (err) => {
            if (err) {
                process.exit(1);
            }
            process.exit();
        });
}
