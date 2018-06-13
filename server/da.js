
'use strict'; // http://www.w3schools.com/js/js_strict.asp

// web framework
let rp = require('request-promise');

let da_environments = {
    prod : 'https://developer.api.autodesk.com/da/us-east/v3',
    preprod : 'https://developer.api.autodesk.com/preview.da/us-east/v3',
    stg : 'https://developer-stg.api.autodesk.com/da/us-east/v3',
    dev : 'https://developer-dev.api.autodesk.com/da/us-west/v3',
};


function enginesv1(req,res) {


    let response = {
        engines : []
    };

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
        });}


function appsv1(req,res) {
    let response = {
        applications : []
    };
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

}


function postworkitemv1(req,res) {


    let baseUrl = da_environments[req.headers.environment];

    console.log(req.body);

    let wiUrl = {
        url: baseUrl+ '/workitems',
        method : 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.headers.authorization
        },
        body : JSON.stringify(req.body)
    };

    rp(wiUrl).then(function (response) {
        let object = JSON.parse(response);
        console.log(object);
        res.status(200).end(response);
    })
    .catch(function (err) {
        console.log(err);
        res.status(400).end(JSON.stringify(err));
    });
}


function getworkitemv1(req,res) {

    if(!req.params.id) {
        res.status(400).end();
        return;
    }

    let baseUrl = da_environments[req.headers.environment];

    let wiUrl = {
        url: baseUrl+ '/workitems/' + req.params.id,
        headers: {
            'Authorization': req.headers.authorization
        }
    };

    rp(wiUrl).then(function (response) {
        let object = JSON.parse(response);
        console.log(object);
        res.status(200).end(response);
    }).catch(function (err) {
        console.log(err.message);
        res.status(400).end(JSON.stringify(err));
    });
}

function appsv2(req,res) {
    let response = {
        applications : []
    };
    let baseUrl = da_environments[req.headers.environment];

    let appsUrl = {
        url: baseUrl+ '/appbundles',
        headers: {
            'Authorization': req.headers.authorization
        }
    };

    let fetch = [
        rp(appsUrl).then(function (result) {
            let apps = JSON.parse(result);
            return Promise.all(apps.data.map( function (app) {

                let appsDetailsUrl = {
                    url: baseUrl+ '/appbundles/' + app,
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

}


function activitiesv1(req,res) {
    let response = {
        activities : []
    };
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
}


module.exports = {
    prod : {
        getApps :   appsv1,
        getEngines : enginesv1,
        getActivities : activitiesv1,
        postWorkitem : postworkitemv1,
        getWorkitem : getworkitemv1
    },
    preprod : {
        getApps :   appsv1,
        getEngines : enginesv1,
        getActivities : activitiesv1,
        postWorkitem : postworkitemv1,
        getWorkitem : getworkitemv1
    },
    stg : {
        getApps :   appsv2,
        getEngines : enginesv1,
        getActivities : activitiesv1,
        postWorkitem : postworkitemv1,
        getWorkitem : getworkitemv1
    },
    dev : {
        getApps :   appsv1,
        getEngines : enginesv1,
        getActivities : activitiesv1,
        postWorkitem : postworkitemv1,
        getWorkitem : getworkitemv1
    }
};