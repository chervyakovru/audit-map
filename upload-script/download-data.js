const firestoreService = require('firestore-export-import');
const serviceAccount = require('./serviceAccountKey.json');

const databaseURL = 'https://audite-map.firebaseio.com';

firestoreService.initializeApp(serviceAccount, databaseURL);

const path = 'yourPath';
firestoreService.backup(path).then(data => console.log(JSON.stringify(data)));
