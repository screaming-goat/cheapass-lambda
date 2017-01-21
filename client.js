'use strict';

var firebase = require('./firebase.js');
var database = firebase.database();

const util = require('util');
const vm = require('vm');

// ******
// Register client
// ******
console.log('Registering client...');
var clientKey = database.ref('/clients').push().key;
database.ref('/clients/' + clientKey).set({
    timeConnected: JSON.stringify(new Date())
});

// ******
// Listen and recieve client code
// ******
var clientCode = '';
database.ref('/clientCode').on('value', function(data) {
    clientCode = data.val();
    console.log('Code updated');
});


// ******
// Listen for incoming jobs and run client code on them
// ******
database.ref('/job/' + clientKey + '/input').on('value', function(incomingJob) {
    if (incomingJob.val() != null) {
        console.log('Incoming job', incomingJob.val());

		// Set status
        var job = incomingJob.val();
        const script = new vm.Script(clientCode);
        const context = new vm.createContext(job);
        script.runInContext(context);

        console.log('Result:', util.inspect(job.result));
		database.ref('/job/' + clientKey).update({ result: job.result });
    }
});

console.log('Done');
