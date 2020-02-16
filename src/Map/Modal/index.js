import React from 'react';
import UIkit from 'uikit';
import { getDocRef } from '../../api';

import Options from './Options';

import styles from './Modal.module.css';

const Modal = ({ doc, selectedPoint, setSelectedPointId }) => {
  const modalRef = React.useRef(null);
  const [searchValue, setSearchValue] = React.useState('');
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    if (!selectedPoint) {
      setShown(false);
    } else if (!shown) {
      setShown(true);
    }
  }, [selectedPoint]);

  React.useEffect(() => {
    if (shown) {
      UIkit.modal(modalRef.current).show();
    } else {
      UIkit.modal(modalRef.current).hide();
    }
  }, [shown]);

  React.useEffect(() => {
    if (selectedPoint && shown) {
      setShown(true);
    }
  }, [selectedPoint]);

  React.useEffect(() => {
    return UIkit.util.on(modalRef.current, 'hidden', () => {
      setSelectedPointId(null);
    });
  }, []);

  const onRename = e => {
    const name = e.target.value;
    const documentRef = getDocRef(doc.id);
    const { points } = doc;
    const newPoints = points.map(point => {
      if (point.id !== selectedPoint.id) return point;
      return {
        ...point,
        name
      };
    });
    documentRef.update({
      points: newPoints
    });
  };

  return (
    <div
      ref={modalRef}
      id="modal-container"
      className="uk-modal-container"
      uk-modal="true"
    >
      <div className="uk-modal-dialog uk-modal-body">
        <button
          className="uk-modal-close-default"
          type="button"
          uk-close="true"
        />
        <div className="uk-flex uk-flex-column">
          <input
            className={`${styles.title} uk-h4`}
            type="text"
            value={
              selectedPoint && selectedPoint.name ? selectedPoint.name : ''
            }
            onChange={onRename}
          />
          <Options
            doc={doc}
            selectedPoint={selectedPoint}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
