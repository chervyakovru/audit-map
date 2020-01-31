import React from 'react';

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
          </div>
        </div>
      </nav>
    </div>
  );
};

export default function() {
  return <Header />;
}
