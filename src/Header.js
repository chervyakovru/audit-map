import React from 'react';
import { MdExitToApp } from 'react-icons/md';

import { Link, useLocation } from 'react-router-dom';
import firebase from './firebase';
import { ROUTES } from './Consts';

const Header = () => {
  const location = useLocation();
  return (
    <div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky">
      <nav className="uk-navbar-container">
        <div className="uk-container ">
          <div className="uk-navbar" uk-navbar="true">
            <div className="uk-navbar-left">
              <div className="uk-navbar-item">
                <h3 className="uk-margin-remove">
                  {false &&
                    ((location.pathname === ROUTES.HOME && 'Доски') ||
                      (location.pathname === ROUTES.VIOLATIONS && 'Нарушения'))}
                </h3>
              </div>
            </div>
            <div className="uk-navbar-right">
              <div className="uk-navbar-item">
                <ul className="uk-navbar-nav">
                  <li className={`${location.pathname === ROUTES.HOME && 'uk-active'}`}>
                    <Link to={ROUTES.HOME}>Доски</Link>
                  </li>
                  <li className={`${location.pathname === ROUTES.VIOLATIONS && 'uk-active'}`}>
                    <Link to={ROUTES.VIOLATIONS}>Нарушения</Link>
                  </li>
                </ul>
              </div>
              <div className="uk-navbar-item">
                <button
                  type="button"
                  className="uk-button uk-button-text"
                  onClick={() => {
                    firebase.auth().signOut();
                  }}
                >
                  <MdExitToApp size="25px" />
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
