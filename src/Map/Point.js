/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Map.module.css';

const handleKeyPress = () => {};

const Point = ({ scale, point }) => {
  const history = useHistory();

  const pointScale = 1 / scale;
  return (
    <div
      className={`${styles.dot} uk-position-absolute`}
      style={{
        transform: `translateX(-50%) translateY(-100%) scale(${pointScale})`,
        left: `${point.x}%`,
        top: `${point.y}%`
      }}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        history.push({
          state: { modalPointId: point.id }
        });
      }}
      onKeyPress={handleKeyPress}
      uk-tooltip={point.name ? `title: ${point.name}; delay: 500` : ''}
    >
      <span className={styles.circle}>
        <span className={styles.title}>{point.name}</span>
      </span>
    </div>
  );
};

export default Point;
