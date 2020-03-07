import React from 'react';
import { Link } from 'react-router-dom';

import { MdUndo, MdHome } from 'react-icons/md';

import Button from '../Button';
import BoardPanel from '../BoardPanel';

import { ROUTES } from '../Consts';

const UndoButton = ({ pointsLength, handleUndo, docName }) => {
  return (
    <BoardPanel title={docName}>
      <Link to={ROUTES.HOME} className="uk-link-reset">
        <Button onClick={null} tooltip="На главную">
          <MdHome size="25px" />
        </Button>
      </Link>
      <Button
        onClick={handleUndo}
        tooltip="Отменить"
        disabled={pointsLength === 0}
      >
        <MdUndo size="25px" />
      </Button>
    </BoardPanel>
  );
};

export default UndoButton;
