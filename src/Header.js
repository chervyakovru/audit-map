import React from 'react';
import { MdExitToApp } from 'react-icons/md';

import { Link, useLocation } from 'react-router-dom';
import firebase from './firebase';
import { ROUTES } from './Consts';

const Header = ({ leftPart }) => {
  const location = useLocation();
  console.log('render Header');
  return (
    <nav className="uk-navbar-container">
      <div className="uk-container ">
        <div className="uk-navbar" uk-navbar="true">
          <div className="uk-navbar-left">
            <div className="uk-navbar-item">{leftPart}</div>
          </div>
          <div className="uk-navbar-right">
            <div className="uk-navbar-item">
              <ul className="uk-navbar-nav">
                <li className={`${location.pathname === ROUTES.HOME && 'uk-active'}`}>
                  <Link to={ROUTES.HOME}>Документы</Link>
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
  );
};

export default Header;
