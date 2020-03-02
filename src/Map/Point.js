/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { useHistory } from 'react-router-dom';

import styles from './Map.module.css';

const handleKeyPress = () => {};

const Point = ({ onDeletePoint, scale, point }) => {
  const history = useHistory();
  const [pressed, setPressed] = React.useState(false);
  const pointScale = 1 / scale;

  const onContext = e => {
    e.preventDefault();
    e.stopPropagation();

    onDeletePoint(point);
  };

  const onTouchEnd = () => {
    setPressed(false);
  };

  const onTouchStart = () => {
    if (!pressed) {
      setPressed(true);
      setTimeout(() => {
        if (pressed) {
          onDeletePoint(point);
        }
      }, 1000);
    }
  };

  const onClick = e => {
    e.preventDefault();
    e.stopPropagation();

    history.push({
      state: { modalPointId: point.id }
    });
  };

  return (
    <div
      className={`${styles.dot} uk-position-absolute`}
      style={{
        transform: `translateX(-15px) translateY(-15px) scale(${pointScale})`,
        left: `${point.x}%`,
        top: `${point.y}%`
      }}
      onClick={onClick}
      onContextMenu={onContext}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onKeyPress={handleKeyPress}
      uk-tooltip={`title: ${point.name}; delay: 500`}
    >
      <div className={styles.circle}>
        <div className={styles.title}>{point.name.trim().substr(0, 2)}</div>
      </div>
    </div>
  );
};

export default Point;
