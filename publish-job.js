'use strict';

var firebase = require('./firebase.js');
var database = firebase.database();

const quote = `Inspirational Bible Verses - Read inspirational quotes and Scripture from the Bible that can help encourage your spirit as you in times of doubt, loss, mourning, sadness, or hopelessness. The Holy Bible has many passages that can uplift your mind and heart, giving you the strength you need to get through each day. 2 Timothy 3:16 tells us that ALL Scripture is inspired by God and useful for teaching, rebuking, correcting, and training in righteousness. The Bible is a work of God that was written by human men that were inspired by God. What better source of inspiration than our Creator! Whether you are looking for motivation, encouragement, reassurance, or peace, the Bible should be the first resource you turn to!
    This collection of inspirational Bible verses can lead you into a deeper understanding of who God is and what His plan is for your life. He wants to "prosper you and not to harm you, to give hope and a future" (Jeremiah 29:11) You can also send these to a family member or friend in need and be assured that God can work miracles when we choose to believe His promises! Use these verses to be inspired and motivated to continue believing and having faith! For more encouragement read 30 Inspiring Christian Quotes at Crosswalk.com. These quotes will point you back to Christ and challenge you to bring Jesus into every area of your life!`;

database.ref('/clients').once('value')
    .then(clientListSnapshot => {
        const clientList = clientListSnapshot.val();
        console.log('Client list: ', clientList);
        const text = quote.trim().replace(/\s{2,}/," ").replace(/[\r]?\n/," ");

        const clientIds = Object.keys(clientList);
        const textArray = text.split(/\s/);
        const noOfWordsInChunk = Math.floor(textArray.length / clientIds.length);

        const jobs = {};

        clientIds.forEach(clientId => {
            const words = textArray.splice(0, noOfWordsInChunk).join(" ");
            jobs[clientId] = {
                input: {
                    words
                }
            };
        });

        const allResultsPromiseList = clientIds.map(clientId =>
            new Promise(resolve =>
                database.ref('/job/' + clientId + '/result').on('value', jobResultValue => {
                    const jobResult = jobResultValue.val();
                    if (jobResult != null) {
                        database.ref('/job/' + clientId).remove();
                        resolve(jobResult);
                    };
                })));

        Promise.all(allResultsPromiseList)
            .then(results => {
                const result = results.reduce((accumulator, item) =>
                    Object.keys(item).reduce((acc, key) => {
                        acc[key] = acc[key] ?
                            acc[key] + item[key] :
                            item[key];
                        return acc;
                    }, accumulator)
                , {});
                console.log(result);
            })
            .then(() => {
                firebase.database().goOffline();
            });

        database.ref('/job/').set(jobs);
    })
