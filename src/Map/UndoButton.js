import React from 'react';
import { Link } from 'react-router-dom';

import { MdUndo, MdHome } from 'react-icons/md';

import Button from './Button';

const UndoButton = props => {
  const { pointsLength, handleUndo, docName } = props;

  return (
    <div
      style={{ fontSize: 0 }}
      className="
              uk-position-z-index
              uk-card
              uk-card-body
              uk-card-default
              uk-flex
              uk-padding-remove
              uk-position-fixed
              uk-position-small
              uk-position-top-left
            "
    >
      <Link to="/dashboard" className="uk-link-reset">
        <Button onClick={null} tooltip="На главную">
          <MdHome size="25px" />
        </Button>
      </Link>
      <div className="uk-flex uk-flex-middle">
        <h3
          style={{
            borderLeft: '1px solid #e5e5e5',
            borderRight: '1px solid #e5e5e5'
          }}
          className="
            uk-margin-remove-top
            uk-padding-small
            uk-padding-remove-top
            uk-padding-remove-bottom
            uk-margin-remove-bottom
            uk-display-block"
        >
          {docName}
        </h3>
      </div>
      <Button
        onClick={handleUndo}
        tooltip="Отменить"
        disabled={pointsLength === 0}
      >
        <MdUndo size="25px" />
      </Button>
    </div>
  );
};

export default UndoButton;
