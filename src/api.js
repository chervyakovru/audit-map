import firebase from './firebase';

export const fbTimestamp = firebase.firestore.FieldValue.serverTimestamp();

export const getBoardsCollection = userId =>
  firebase.firestore().collection(`users/${userId}/boards`);
