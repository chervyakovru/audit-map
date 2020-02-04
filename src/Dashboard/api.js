import firebase from '../firebase';

export const getDocCollection = () => {
  const db = firebase.firestore();
  return db.collection('documents');
};

export const getDocRef = id => {
  const collection = getDocCollection();
  return collection.doc(id);
};

export const getFbTimestamp = () =>
  firebase.firestore.FieldValue.serverTimestamp();
