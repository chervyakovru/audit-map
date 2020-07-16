import React from 'react';
import Header from '../Header';
import ViolationsList from '../ViolationsList';

const Violations = () => {
  return (
    <>
      <Header />
      <div className="uk-section uk-section-small">
        <div className="uk-container">
          <ViolationsList />
        </div>
      </div>
    </>
  );
};

export default Violations;
