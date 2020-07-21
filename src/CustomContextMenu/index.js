import React from 'react';
import { useOutsideClick } from '../utils';
import CustomContextMenuContext from '../CustomContextMenuContext';

import styles from './CustomContextMenu.module.css';

const CustomContextMenu = ({ x, y, menuItems }) => {
  const customContextMenuRef = React.useRef(null);
  const { customContextMenuProps, setCustomContextMenuProps } = React.useContext(CustomContextMenuContext);

  useOutsideClick(customContextMenuRef, () => {
    setCustomContextMenuProps({ ...customContextMenuProps, isVisible: false });
  });

  const getHandleMenuItemClick = onClick => () => {
    setCustomContextMenuProps({ ...customContextMenuProps, isVisible: false });
    onClick();
  };

  return (
    <div
      ref={customContextMenuRef}
      style={{ left: x, top: y }}
      className="uk-card uk-card-small uk-card-default uk-card-body uk-padding-remove-horizontal uk-position-fixed uk-position-z-index"
    >
      <ul className="uk-nav uk-dropdown-nav">
        {menuItems.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={index}>
            <button onClick={getHandleMenuItemClick(item.onClick)} type="button" className={styles.listElement}>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomContextMenu;
