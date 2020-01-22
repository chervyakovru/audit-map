import React from 'react';
import UIkit from 'uikit';
import useStoreon from 'storeon/react';

const Modal = () => {
  const { dispatch, currentPointId } = useStoreon('currentPointId');

  React.useEffect(() => {
    return UIkit.util.on('#modal-container', 'hidden', () => {
      dispatch('currentPoint/seId', null);
    });
  }, [dispatch]);

  return (
    <div id="modal-container" className="uk-modal-container" uk-modal="true">
      <div className="uk-modal-dialog uk-modal-body">
        <button
          className="uk-modal-close-default"
          type="button"
          uk-close="true"
        />
        <h2 className="uk-modal-title">Headline {currentPointId}</h2>
      </div>
    </div>
  );
};

export default Modal;
