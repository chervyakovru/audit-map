import React from 'react';

const CustomContextMenu = React.forwardRef(({ x, y, menuItems }, ref) => (
  <div
    ref={ref}
    style={{ left: x, top: y }}
    className="uk-card uk-card-default uk-card-body uk-position-fixed uk-position-z-index"
  >
    <ul className="uk-list">
      {menuItems.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <li key={index}>
          <button type="button" onClick={item.onClick}>
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  </div>
));

export default CustomContextMenu;
