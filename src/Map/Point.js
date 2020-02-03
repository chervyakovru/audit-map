/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import UIkit from 'uikit';
import useStoreon from 'storeon/react';

import styles from './Map.module.css';

const handleKeyPress = () => {};

const Point = props => {
  const { dispatch } = useStoreon('currentPointId');

  const { point } = props;

  return (
    <div
      className={`${styles.dot} uk-position-absolute`}
      style={{
        left: `${point.x}%`,
        top: `${point.y}%`
      }}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        dispatch('currentPoint/setId', point.id);
        UIkit.modal('#modal-container').show();
      }}
      onKeyPress={handleKeyPress}
      uk-tooltip={point.name ? `title: ${point.name}; delay: 500` : ''}
    >
      <span className={styles.circle}>
        <span className={styles.title}>{point.id}</span>
      </span>
    </div>
  );
};

export default Point;
