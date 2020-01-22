import React from 'react';
import {
  MdAdd,
  MdRemove,
  MdFullscreen,
  MdFullscreenExit
} from 'react-icons/md';

import Button from './Button';

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
      <Button onClick={zoomOut} tooltip="Уменьшить">
        <MdRemove size="25px" />
      </Button>
      <Button onClick={zoomIn} tooltip="Увеличить">
        <MdAdd size="25px" />
      </Button>
      <Button onClick={resetTransform} tooltip="Масштаб 100%">
        <b>{Math.round(scale * 100)}%</b>
      </Button>
      {fullscreen ? (
        <Button
          onClick={exitFullscreen}
          tooltip="Выйти из полноэкранного режима"
        >
          <MdFullscreenExit size="25px" />
        </Button>
      ) : (
        <Button onClick={launchFullscreen} tooltip="Развернуть на весь экран">
          <MdFullscreen size="25px" />
        </Button>
      )}
    </div>
  );
};

export default ZoomButtons;
