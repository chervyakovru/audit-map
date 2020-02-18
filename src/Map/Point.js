/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { useHistory } from 'react-router-dom';
import UIkit from 'uikit';

import { getPointRef } from '../api';

import styles from './Map.module.css';

const handleKeyPress = () => {};

const Point = ({ docId, scale, point }) => {
  const history = useHistory();
  const [pressed, setPressed] = React.useState(false);
  const pointScale = 1 / scale;

  const showModal = () => {
    UIkit.modal
      .confirm(`Вы уверены, что хотите удалить точку "${point.name}"?`, {
        labels: { cancel: 'Отмена', ok: 'Да' },
        bgClose: true,
        escClose: true
      })
      .then(() => {
        const pointRef = getPointRef(docId, point.id);
        pointRef.delete();
      });
  };

  const onContext = e => {
    e.preventDefault();
    e.stopPropagation();

    showModal();
  };

  const onTouchEnd = () => {
    setPressed(false);
  };

  const onTouchStart = () => {
    if (!pressed) {
      setPressed(true);
      setTimeout(() => {
        if (pressed) {
          showModal();
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
        transform: `translateX(-50%) translateY(-100%) scale(${pointScale})`,
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
      <span className={styles.circle}>
        <span className={styles.title}>{point.name.trim().substr(0, 2)}</span>
      </span>
    </div>
  );
};

export default Point;
