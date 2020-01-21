/* eslint-disable react/prop-types */

import React from 'react';
import { MdUndo } from 'react-icons/md';
import styles from './Map.module.css';

const UndoButton = props => {
  const { locationsLength, handleUndo } = props;

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
      <button
        type="button"
        onClick={handleUndo}
        className={`${styles.button} uk-button uk-button-link uk-padding-small`}
        uk-tooltip="title: Отменить; delay: 1500"
        disabled={locationsLength === 0}
      >
        <MdUndo size="25px" />
      </button>
    </div>
  );
};

export default UndoButton;
