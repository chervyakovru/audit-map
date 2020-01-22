/* eslint-disable react/prop-types */

import React from 'react';
import {
  MdAdd,
  MdRemove,
  MdFullscreen,
  MdFullscreenExit
} from 'react-icons/md';
import styles from './Map.module.css';

const ZoomButtons = props => {
  const [fullscreen, setFullscreen] = React.useState(false);

  React.useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      setFullscreen(document.fullscreenElement);
    });
    return () => {
      document.removeEventListener('fullscreenchange');
    };
  }, []);

  const launchFullscreen = () => {
    document.documentElement.requestFullscreen();
  };

  const exitFullscreen = () => {
    document.exitFullscreen();
  };

  const { zoomIn, zoomOut, resetTransform, scale } = props;

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
              uk-position-bottom-right
            "
    >
      <button
        type="button"
        onClick={zoomOut}
        className={`${styles.button} uk-button uk-button-link uk-padding-small`}
        uk-tooltip="title: Уменьшить; delay: 1500"
      >
        <MdRemove size="25px" />
      </button>
      <button
        type="button"
        onClick={zoomIn}
        className={`${styles.button} uk-button uk-button-link uk-padding-small`}
        uk-tooltip="title: Увеличить; delay: 1500"
      >
        <MdAdd size="25px" />
      </button>
      <button
        type="button"
        onClick={resetTransform}
        className={`${styles.button} uk-button uk-button-link uk-padding-small`}
        uk-tooltip="title: Масштаб 100%; delay: 1500"
      >
        <b>{Math.round(scale * 100)}%</b>
      </button>
      {fullscreen ? (
        <button
          type="button"
          onClick={exitFullscreen}
          className={`${styles.button} uk-button uk-button-link uk-padding-small`}
          uk-tooltip="title: Выйти из полноэкранного режима; delay: 1500"
        >
          <MdFullscreenExit size="25px" />
        </button>
      ) : (
        <button
          type="button"
          onClick={launchFullscreen}
          className={`${styles.button} uk-button uk-button-link uk-padding-small`}
          uk-tooltip="title: Развернуть на весь экран; delay: 1500"
        >
          <MdFullscreen size="25px" />
        </button>
      )}
    </div>
  );
};

export default ZoomButtons;
