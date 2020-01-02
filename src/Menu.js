import React from 'react';

export default () => {
  return (
    <>
      <button
        className="
          uk-button
          uk-button-default
          uk-position-fixed
          uk-position-small
          uk-position-top-right
        "
        type="button"
        uk-toggle="target: #offcanvas-usage"
      >
        <span uk-icon="menu" />
      </button>

      <div id="offcanvas-usage" uk-offcanvas="flip: true">
        <div className="uk-offcanvas-bar ">
          <button
            className="uk-offcanvas-close"
            type="button"
            uk-close="true"
          />

          <h4>Меню</h4>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
    </>
  );
};
