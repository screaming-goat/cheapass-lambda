'use strict';
var firebase = require("firebase");
const util = require('util');
const vm = require('vm');

// Initialize Firebase
var config = require('./config.json');
firebase.initializeApp(config.firebase);

// Get a reference to the database service
var database = firebase.database();

console.log('Registering client...');

var key = database.ref('/clients').push().key;
console.log('my key', key);

key = 'test';

/*
 database.ref('/clients/' + key).set({
 name: 'client3'
 });

 firebase.database().ref('/clients/' + key).once('value').then(function(data) {
 var value = data.val();
 console.log('got', value);
 });
 */

var code = '';
database.ref('/clientCode').on('value', function(data) {
    code = data.val();
    console.log('Code updated');
});

database.ref('/job/' + key).on('value', function(job) {
    if (job.val() != null) {
        console.log('Incoming job', job.val());
        var sandbox = job.val();
        const script = new vm.Script(code);
        const context = new vm.createContext(sandbox);
        script.runInContext(context);
        console.log(util.inspect(sandbox));
    }
});

console.log('Done');




/* Useful stuff:
 https://firebase.google.com/docs/database/web/read-and-write

 */
