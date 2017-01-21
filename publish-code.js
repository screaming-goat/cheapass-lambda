var firebase = require('./firebase.js');
var database = firebase.database();

fs = require('fs');
fs.readFile('./code.js', 'UTF-8', function (err, content) {
    if (err) {
        return console.log(err);
    } else {
        database.ref('/clientCode').set(content.trim());
    }
});
