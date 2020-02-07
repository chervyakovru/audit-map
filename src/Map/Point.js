/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';

import styles from './Map.module.css';

const handleKeyPress = () => {};

const Point = ({ point, setSelectedPointId }) => {
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
        setSelectedPointId(point.id);
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
