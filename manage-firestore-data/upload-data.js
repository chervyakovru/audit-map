const firestoreService = require('firestore-export-import');
const serviceAccount = require('./serviceAccountKey.json');

const databaseURL = 'https://audite-map.firebaseio.com';

firestoreService.initializeApp(serviceAccount, databaseURL);

const fileName = 'downloaded-firestore-data.json';
firestoreService.restore(fileName);
