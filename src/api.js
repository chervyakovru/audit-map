import firebase from './firebase';

export const getERCollection = () => {
  const db = firebase.firestore();
  return db.collection('expertReport');
};

export const getDocumentsCollection = () => {
  const db = firebase.firestore();
  const collection = db.collection('documents');
  return collection;
};

export const getDocRef = id => {
  const collection = getDocumentsCollection();
  return collection.doc(id);
};

export const fbTimestamp = firebase.firestore.FieldValue.serverTimestamp();

export const getDocImage = async id => {
  const storage = firebase.storage();
  const imgRef = await storage.ref(`${id}/images/map.jpg`).getDownloadURL();
  console.log('imgRef: ', imgRef);
  return imgRef;
};

export const getFbTimestamp = () =>
  firebase.firestore.FieldValue.serverTimestamp();
