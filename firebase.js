var firebase = require("firebase");
const util = require('util');
const vm = require('vm');

var config = require('./config.json');

// ******
// Intialize firebase
// ******
firebase.initializeApp(config.firebase);

module.exports = firebase;
