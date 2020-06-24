import React from 'react';
import { MdAdd, MdRemove, MdFullscreen, MdFullscreenExit } from 'react-icons/md';

import BoardPanel from '../BoardPanel';
import Button from '../Button';

const ActionsButtons = props => {
  const [fullscreen, setFullscreen] = React.useState(false);

  React.useEffect(() => {
    const setter = () => {
      setFullscreen(document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', setter);
    return () => {
      document.removeEventListener('fullscreenchange', setter);
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
    <BoardPanel position="bottom-right">
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
        <Button onClick={exitFullscreen} tooltip="Выйти из полноэкранного режима">
          <MdFullscreenExit size="25px" />
        </Button>
      ) : (
        <Button onClick={launchFullscreen} tooltip="Развернуть на весь экран">
          <MdFullscreen size="25px" />
        </Button>
      )}
    </BoardPanel>
  );
};

export default ActionsButtons;
