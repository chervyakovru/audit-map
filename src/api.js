import firebase from './firebase';

export const fbTimestamp = firebase.firestore.FieldValue.serverTimestamp();

const getFirestore = () => {
  return firebase.firestore();
};

const getStorage = () => {
  return firebase.storage();
};

export const getERCollection = () => {
  return getFirestore().collection('expertReport');
};

export const getDocumentsCollection = () => {
  return getFirestore().collection('documents');
};

export const getDocRef = id => {
  return getDocumentsCollection().doc(id);
};

export const getPointsCollection = docId => {
  return getDocRef(docId).collection('points');
};

export const getPointRef = (docId, pointId) => {
  return getPointsCollection(docId).doc(pointId);
};

export const getDocFileRef = (id, fileName) => {
  return getStorage().ref(`${id}/images/${fileName}`);
};

export const getDocFileUrl = (id, fileName) => {
  return getDocFileRef(id, fileName).getDownloadURL();
};
