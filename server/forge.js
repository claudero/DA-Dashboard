/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

'use strict'; // http://www.w3schools.com/js/js_strict.asp

// web framework
let express = require('express');
let router = express.Router();
let rp = require('request-promise');

let da_environments = {
    prod : 'https://developer.api.autodesk.com/da/us-east/v3',
    stg : 'https://developer-stg.api.autodesk.com/da/us-east/v3',
    dev : 'https://developer-dev.api.autodesk.com/da/us-west/v3',
};

let auth_environments = {
    prod : 'https://developer.api.autodesk.com/authentication/v1/authenticate',
    stg : 'https://developer-stg.api.autodesk.com/authentication/v1/authenticate',
    dev : 'https://developer-dev.api.autodesk.com/authentication/v1/authenticate',
};


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

    let baseUrl = auth_environments[req.query.environment];

    if(!baseUrl) {
        res.status(400).end();
        return;
    }


    let authRequestUrl = {
        url: baseUrl,
        method : 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body : 'client_id=' + encodeURIComponent(req.query.client_id) + '&client_secret=' + encodeURIComponent(req.query.client_secret) + '&grant_type=client_credentials&scope=code:all'
  };

    rp(authRequestUrl).then(function (result) {
        let auth = JSON.parse(result);
        res.status(200).end(auth.access_token);
    })
    .catch(function (err) {
            console.log(err.message);
            res.status(400).end(JSON.stringify(err));
    });
});


router.get('/api/getengines', function (req, res) {

    let response = {
        engines : []
    };

    if(!req.headers.environment) {
        res.status(400).end();
        return;
    }

    let baseUrl = da_environments[req.headers.environment];

    let enginesUrl = {
        url: baseUrl+ '/engines',
        headers: {
            'Authorization': req.headers.authorization
        }
    };

    let fetch = [
        rp(enginesUrl).then(function (result) {
            let engines = JSON.parse(result);

            return Promise.all(engines.data.map( function (engine) {

                let enginesDetailsUrl = {
                    url: baseUrl+ '/engines/' + engine,
                    headers: {
                        'Authorization': req.headers.authorization
                    }
                };

                return rp(enginesDetailsUrl).then( function (engineDetails) {
                    let engine = JSON.parse(engineDetails);

                    return {
                        productVersion : engine.productVersion,
                        description : engine.description,
                        version : engine.version.toString(),
                        id : engine.id
                    };
                });
            }));
        })
    ];

    Promise.all(fetch)
        .then(function (result) {
            response.engines = result[0].map( function (engines) {
                return engines;
            });
            res.status(200).end(JSON.stringify(response));
        })
        .catch(function (err) {
            console.log(err.message);
            res.status(400).end(JSON.stringify(err));
        });
});


router.get('/api/getapplications', function (req, res) {
    let response = {
        applications : []
    };

    if(!req.headers.environment) {
        res.status(400).end();
        return;
    }

    let baseUrl = da_environments[req.headers.environment];

    let appsUrl = {
        url: baseUrl+ '/apps',
        headers: {
            'Authorization': req.headers.authorization
        }
    };

    let fetch = [
        rp(appsUrl).then(function (result) {
            let apps = JSON.parse(result);
            return Promise.all(apps.data.map( function (app) {

                let appsDetailsUrl = {
                    url: baseUrl+ '/apps/' + app,
                    headers: {
                        'Authorization': req.headers.authorization
                    }
                };

                return rp(appsDetailsUrl).then( function (appDetails) {

                    let app = JSON.parse(appDetails);

                    return {
                        engine : app.engine,
                        description : app.description,
                        version : app.version.toString(),
                        id : app.id
                    };
                });
            }));
        })
    ];

    Promise.all(fetch)
        .then(function (result) {
            response.applications = result[0].map( function (apps) {
                return apps;
            });

            res.status(200).end(JSON.stringify(response));
        })
        .catch(function (err) {
            console.log(err.message);
            res.status(400).end(JSON.stringify(err));
        });
});



router.get('/api/getactivities', function (req, res) {
    let response = {
        activities : []
    };

    if(!req.headers.environment) {
        res.status(400).end();
        return;
    }

    let baseUrl = da_environments[req.headers.environment];

    let activitiesUrl = {
        url: baseUrl+ '/activities',
        headers: {
            'Authorization': req.headers.authorization
        }
    };

    let fetch = [
        rp(activitiesUrl).then(function (result) {
            let activities = JSON.parse(result);
            return Promise.all(activities.data.map( function (activity) {

                let activityDetailsUrl = {
                    url: baseUrl+ '/activities/' + activity,
                    headers: {
                        'Authorization': req.headers.authorization
                    }
                };

                return rp(activityDetailsUrl).then( function (activityDetails) {

                    let activity = JSON.parse(activityDetails);

                    activity.version = activity.version.toString();
                    return activity;
                });
            }));
        })
    ];

    Promise.all(fetch)
        .then(function (result) {
            response.activities = result[0].map( function (activity) {
                return activity;
            });
            res.status(200).end(JSON.stringify(response));
        })
        .catch(function (err) {
            console.log(err.message);
            res.status(400).end(JSON.stringify(err));
        });
});
module.exports = router;