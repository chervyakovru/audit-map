import React from 'react';
import UIkit from 'uikit';
import useStoreon from 'storeon/react';
import styles from './Modal.module.css';

import Options from './Options';

const Modal = () => {
  const nameInputRef = React.useRef(null);
  const { dispatch, currentPointId, points } = useStoreon(
    'currentPointId',
    'points'
  );

  const currentPoint = points.find(point => point.id === currentPointId);

  React.useEffect(() => {
    return UIkit.util.on('#modal-container', 'hidden', () => {
      dispatch('currentPoint/setId', null);
    });
  }, []);

  React.useEffect(() => {
    if (currentPoint && !currentPoint.name) {
      nameInputRef.current.focus();
    }
  });

  const onNameSave = e => {
    dispatch('points/update', {
      ...currentPoint,
      name: e.target.value
    });
  };

  return (
    <div id="modal-container" className="uk-modal-container" uk-modal="true">
      <div className="uk-modal-dialog uk-modal-body">
        <button
          className="uk-modal-close-default"
          type="button"
          uk-close="true"
        />
        <div className="uk-flex uk-flex-column">
          <input
            ref={nameInputRef}
            className={`${styles.title} uk-h4`}
            type="text"
            value={currentPoint && currentPoint.name ? currentPoint.name : ''}
            onChange={onNameSave}
          />
          <Options currentPoint={currentPoint} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
