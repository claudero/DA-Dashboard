
'use strict'; // http://www.w3schools.com/js/js_strict.asp

// web framework
let express = require('express');
let router = express.Router();


let auth_apis = require('./auth');
let da_apis = require('./da');
let oss_apis = require('./oss');

router.get('/api/getapptoken', function (req, res) {
    if(!req.query.client_id) {
        res.status(400).end();
        return;
    }
    if(!req.query.client_secret) {
        res.status(400).end();
        return;
    }
    if(!req.query.token) {
        res.status(400).end();
        return;
    }
    if(!req.query.environment) {
        res.status(400).end();
        return;
    }

    let api_collection = auth_apis[req.query.environment];

    if(!api_collection) {
        res.status(400).end();
        return;
    }

    api_collection.gettoken(req,res);
});


router.get('/api/getengines', function (req, res) {

    if(!req.headers.environment) {
        res.status(400).end();
        return;
    }

    let api_collection = da_apis[req.headers.environment];

    if(!api_collection) {
        res.status(400).end();
        return;
    }

    api_collection.getEngines(req,res);

});


router.get('/api/getapplications', function (req, res) {

    if(!req.headers.environment) {
        res.status(400).end();
        return;
    }

    let api_collection = da_apis[req.headers.environment];

    if(!api_collection) {
        res.status(400).end();
        return;
    }

    api_collection.getApps(req,res);

});



router.get('/api/getactivities', function (req, res) {


    if(!req.headers.environment) {
        res.status(400).end();
        return;
    }

    let api_collection = da_apis[req.headers.environment];

    if(!api_collection) {
        res.status(400).end();
        return;
    }

    api_collection.getActivities(req,res);

});


router.post('/api/workitem', function (req, res) {



    console.log("workitem!")
    console.log(req.headers.environment);
    if(!req.headers.environment) {
        res.status(400).end();
        return;
    }

    let api_collection = da_apis[req.headers.environment];

    if(!api_collection) {
        res.status(400).end();
        return;
    }

    console.log("workitem! good ")

    api_collection.postWorkitem(req,res);

});


router.get('/api/workitem/:id', function (req, res) {

    if(!req.params.id) {
        res.status(400).end();
        return;
    }

    if(!req.headers.environment) {
        res.status(400).end();
        return;
    }

    let api_collection = da_apis[req.headers.environment];

    if(!api_collection) {
        res.status(400).end();
        return;
    }

    api_collection.getWorkitem(req,res);

});


router.get('/api/buckets', function (req, res) {


    if(!req.headers.environment) {
        res.status(400).end();
        return;
    }

    let api_collection = oss_apis[req.headers.environment];

    if(!api_collection) {
        res.status(400).end();
        return;
    }

    api_collection.getBuckets(req,res);

});

router.get('/api/objects/:id', function (req, res) {

    if(!req.params.id) {
        res.status(400).end();
        return;
    }

    if(!req.headers.environment) {
        res.status(400).end();
        return;
    }

    let api_collection = oss_apis[req.headers.environment];

    if(!api_collection) {
        res.status(400).end();
        return;
    }

    api_collection.getObjects(req,res);

});

module.exports = router;