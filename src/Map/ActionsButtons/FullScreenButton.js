import React from 'react';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';

import Button from '../../Button';

const FullScreenButton = () => {
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

  return fullscreen ? (
    <Button onClick={exitFullscreen} tooltip="Выйти из полноэкранного режима">
      <MdFullscreenExit size="25px" />
    </Button>
  ) : (
    <Button onClick={launchFullscreen} tooltip="Развернуть на весь экран">
      <MdFullscreen size="25px" />
    </Button>
  );
};

export default FullScreenButton;
