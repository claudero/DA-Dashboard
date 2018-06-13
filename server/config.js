
'use strict'; // http://www.w3schools.com/js/js_strict.asp

module.exports = {
  // set enviroment variables or hard-code here
  credentials: {
    client_id: process.env.FORGE_CLIENT_ID || '<replace with your consumer key>',
    client_secret: process.env.FORGE_CLIENT_SECRET || '<replace with your consumer secret>',
  },

  // Required scopes for your application on server-side
  scopeInternal: 'code:all',
  // Required scope of the token sent to the client
  scopePublic: 'data:read',
};