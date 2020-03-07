import React from 'react';
import * as firebaseui from 'firebaseui';
import firebase from './firebase';

const ui = new firebaseui.auth.AuthUI(firebase.auth());

const PublicHomePage = () => {
  React.useEffect(() => {
    ui.start('#firebaseui-auth-container', {
      signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID]
      // Other config options...
    });
  }, []);

  return (
    <>
      <h1>Home</h1>
      <div id="firebaseui-auth-container" />
    </>
  );
};

export default PublicHomePage;
