import React from 'react';

export const CustomContextMenuProps = {
  x: 0,
  y: 0,
  menuItems: [],
  isVisible: false,
};

const CustomContextMenuContext = React.createContext({
  customContextMenuProps: CustomContextMenuProps,
  setCustomContextMenuProps: () => {},
});

export default CustomContextMenuContext;
