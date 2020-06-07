import firebase from './firebase';

export const fbTimestamp = firebase.firestore.FieldValue.serverTimestamp();

export const getBoardsCollection = userId => firebase.firestore().collection(`users/${userId}/boards`);

export const getLayersCollection = (userId, boardId) =>
  firebase.firestore().collection(`users/${userId}/boards/${boardId}/layers`);

export const getThemesCollection = () => {
  return firebase.firestore().collection('themes');
};

export const getERCollection = () => {
  return firebase.firestore().collection('expertReport');
};

export const getFileRef = (userId, boardId, layerId, fileName) => {
  return firebase.storage().ref(`/users/${userId}/boards/${boardId}/layers/${layerId}/files/${fileName}`);
};

export const getPointsCollection = (userId, boardId, layerId) => {
  return getLayersCollection(userId, boardId)
    .doc(layerId)
    .collection('points');
};
