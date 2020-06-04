import firebase from './firebase';

export const fbTimestamp = firebase.firestore.FieldValue.serverTimestamp();

export const getBoardsCollection = userId => firebase.firestore().collection(`users/${userId}/boards`);

export const getThemesCollection = () => {
  return firebase.firestore().collection('themes');
};

export const getERCollection = () => {
  return firebase.firestore().collection('expertReport');
};

export const getFileRef = (userId, boardId, fileName) => {
  return firebase.storage().ref(`/users/${userId}/boards/${boardId}/files/${fileName}`);
};

export const getPointsCollection = (userId, docId) => {
  return getBoardsCollection(userId)
    .doc(docId)
    .collection('points');
};
