/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import UIkit from 'uikit';
import useStoreon from 'storeon/react';

import styles from './Map.module.css';

const DOT_SIZE = 10;
const handleKeyPress = () => {};

const Dot = props => {
  const { dispatch } = useStoreon('currentPointId');

  const { id, x, y } = props;

  return (
    <div
      className={`${styles.dot} uk-position-absolute uk-transform-center`}
      style={{
        width: `${DOT_SIZE}px`,
        height: `${DOT_SIZE}px`,
        left: `${x}%`,
        top: `${y}%`
      }}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        dispatch('currentPoint/seId', id);
        UIkit.modal('#modal-container').show();
      }}
      onKeyPress={handleKeyPress}
    >
      <span>{id}</span>
    </div>
  );
};

export default Dot;
