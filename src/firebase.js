import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyAYY-gOlAnUHHx1LUwEpXWcWYdoG3NQOks',
  authDomain: 'audite-map.firebaseapp.com',
  databaseURL: 'https://audite-map.firebaseio.com',
  projectId: 'audite-map',
  storageBucket: 'audite-map.appspot.com',
  messagingSenderId: '647791630889',
  appId: '1:647791630889:web:81d214d1a9917e64381a38'
};

firebase.initializeApp(config);

export default firebase;
