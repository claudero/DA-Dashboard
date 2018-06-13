
'use strict'; // http://www.w3schools.com/js/js_strict.asp

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// favicon
// prepare server routing
app.set('trust proxy', 1) // trust first proxy - HTTPS on Heroku
app.set('port', process.env.PORT || 3001); // main port

// prepare our API endpoint routing
var forge = require('./forge');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/../build')); // redirect static calls
app.use('/', forge); // redirect oauth API calls

module.exports = app;