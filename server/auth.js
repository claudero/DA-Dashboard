
'use strict'; // http://www.w3schools.com/js/js_strict.asp

// web framework
let rp = require('request-promise');



let auth_environments = {
    prod : 'https://developer.api.autodesk.com/authentication/v1/authenticate',
    preprod : 'https://developer.api.autodesk.com/authentication/v1/authenticate',
    stg : 'https://developer-stg.api.autodesk.com/authentication/v1/authenticate',
    dev : 'https://developer-dev.api.autodesk.com/authentication/v1/authenticate',
};


function tokenv1(req,res) {

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
        body : 'client_id=' + encodeURIComponent(req.query.client_id) + '&client_secret=' + encodeURIComponent(req.query.client_secret) + '&grant_type=client_credentials&scope=code:all data:read data:write bucket:read bucket:create'
    };

    rp(authRequestUrl).then(function (result) {
        let auth = JSON.parse(result);
        res.status(200).end(auth.access_token);
    })
        .catch(function (err) {
            console.log(err.message);
            res.status(400).end(JSON.stringify(err));
        });
}


module.exports = {
    prod : {
        gettoken :   tokenv1
    },
    preprod : {
        gettoken :   tokenv1
    },
    stg : {
        gettoken :   tokenv1
    },
    dev : {
        gettoken :   tokenv1
    }
};