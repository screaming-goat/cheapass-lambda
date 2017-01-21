var firebase = require("firebase");

var config = require('./config.json');

// ******
// Intialize firebase
// ******
firebase.initializeApp(config.firebase);

module.exports = firebase;
