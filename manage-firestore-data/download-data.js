const fs = require('fs');
const firestoreService = require('firestore-export-import');
const serviceAccount = require('./serviceAccountKey.json');

const databaseURL = 'https://audite-map.firebaseio.com';

firestoreService.initializeApp(serviceAccount, databaseURL);

const path = 'collection-path'; // Replace with your Firestore collection path
firestoreService.backup(path).then(data => {
  fs.writeFileSync('./downloaded-firestore-data.json', JSON.stringify(data), 'utf8');
});
