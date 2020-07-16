import React from 'react';

import { MdRotateRight } from 'react-icons/md';
import Button from '../../Button';

const handleChange = async () => {};

const RotateButton = () => {
  return (
    <Button onClick={handleChange} tooltip="Повернуть по часовой стрелке">
      <MdRotateRight size="25px" />
    </Button>
  );
};

export default RotateButton;
