
'use strict'; // http://www.w3schools.com/js/js_strict.asp

// web framework
let rp = require('request-promise');
const ForgeSDK = require('forge-apis');


const BucketsAPI = new ForgeSDK.BucketsApi();
const ObjectsAPI = new ForgeSDK.ObjectsApi();
const bucketExists = 'bucketExists';


function getToken(req) {

    let bearer = 'Bearer ';
    if(!req.headers.authorization.startsWith(bearer)) {
        return null;
    }

    return {
        access_token : req.headers.authorization.slice(bearer.length)
    };
}

function getBuckets(req,res) {


    let token = getToken(req);

    if(!token) {
        res.status(400).end();
    }


    BucketsAPI.getBuckets({limit : 100}, null, token)
        .then((response) => {
            res.status(200).end(JSON.stringify(response));
        })
        .catch(function (err) {
            console.log(err);
            res.status(400).end(JSON.stringify(err));
        });

}



function getObjects(req,res) {


    let token = getToken(req);

    if(!token) {
        res.status(400).end();
    }

    if(!req.params.id) {
        res.status(400).end();
        return;
    }

    console.log(token)
    console.log(req.params.id)


    ObjectsAPI.getObjects(req.params.id , {limit : 100}, null, token)
        .then((response) => {
            console.log("objects:");
            console.log(response.body);
            res.status(200).end(JSON.stringify(response));
        })
        .catch(function (err) {
            console.log(err);
            res.status(400).end(JSON.stringify(err));
        });

}


module.exports = {
    prod : {
        getBuckets :   getBuckets,
        getObjects :   getObjects
    },
    preprod : {
        getBuckets :   getBuckets,
        getObjects :   getObjects
    },
    stg : {
        getBuckets :   getBuckets,
        getObjects :   getObjects
    },
    dev : {
        getBuckets :   getBuckets,
        getObjects :   getObjects
    }
};