import React from 'react';

const POSITIONS = Object.freeze({
  'top-left': 'uk-position-top-left',
  'top-right': 'uk-position-top-right',
  'bottom-left': 'uk-position-bottom-left',
  'bottom-right': 'uk-position-bottom-right',
});

const BoardPanel = ({ children, position }) => {
  return (
    <div
      className={`
        uk-position-z-index
        uk-card
        uk-card-body
        uk-card-default
        uk-flex
        uk-padding-remove
        uk-position-fixed
        uk-position-small
        ${POSITIONS[position]}`}
    >
      {children}
    </div>
  );
};

export default BoardPanel;
