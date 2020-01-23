import React from 'react';
import { MdUndo } from 'react-icons/md';

import Button from './Button';

const UndoButton = props => {
  const { pointsLength, handleUndo } = props;

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
