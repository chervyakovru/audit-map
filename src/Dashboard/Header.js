import React from 'react';
import firebase from '../firebase';

const Header = () => {
  return (
    <div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky">
      <nav className="uk-navbar-container">
        <div className="uk-container">
          <div className="uk-navbar" uk-navbar="true">
            <div className="uk-navbar-left">
              <div className="uk-navbar-item">
                <h3 className="uk-margin-remove">Все документы</h3>
              </div>
            </div>
            <div className="uk-navbar-right">
              <div className="uk-navbar-item">
                <button
                  type="button"
                  className="uk-button uk-button-text"
                  onClick={() => {
                    firebase.auth().signOut();
                  }}
                >
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default function() {
  return <Header />;
}
