import React from 'react';

const BoardPanel = ({ children, title }) => {
  return (
    <div
      className="
        uk-position-z-index
        uk-card
        uk-card-body
        uk-card-default
        uk-flex
        uk-padding-remove
        uk-position-fixed
        uk-position-small
        uk-position-top-left"
    >
      {children[0] || children}
      {title && (
        <div className="uk-flex uk-flex-middle">
          <h3
            style={{
              borderLeft: '1px solid #e5e5e5',
              borderRight: children[1] ? '1px solid #e5e5e5' : ''
            }}
            className="
            uk-margin-remove
            uk-display-block
            uk-padding-small
            uk-padding-remove-top
            uk-padding-remove-bottom
            "
          >
            {title}
          </h3>
        </div>
      )}
      {children[1]}
    </div>
  );
};

export default BoardPanel;
