import firebase from '../firebase';

export const getERCollection = () => {
  const db = firebase.firestore();
  return db.collection('expertReport');
};

export const getDocCollection = () => {
  const db = firebase.firestore();
  const collection = db.collection('documents');
  return collection;
};

export const getDocRef = id => {
  const collection = getDocCollection();
  return collection.doc(id);
};

export const getFbTimestamp = () =>
  firebase.firestore.FieldValue.serverTimestamp();
