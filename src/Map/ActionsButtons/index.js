import React from 'react';
import { MdAdd, MdRemove, MdRotateRight } from 'react-icons/md';

import BoardPanel from '../../BoardPanel';
import Button from '../../Button';
import FullScreenButton from './FullScreenButton';

const ActionsButtons = props => {
  const { zoomIn, zoomOut, resetTransform, scale, rotateImage } = props;

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
      <Button onClick={rotateImage} tooltip="Повернуть по часовой стрелке">
        <MdRotateRight size="25px" />
      </Button>
      <FullScreenButton />
    </BoardPanel>
  );
};

export default ActionsButtons;
