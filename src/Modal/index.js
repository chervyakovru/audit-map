import React from 'react';
import UIkit from 'uikit';
import useStoreon from 'storeon/react';
import { useParams } from 'react-router-dom';

import styles from './Modal.module.css';

import Options from './Options';

const Modal = () => {
  const { dispatch, currentPointId, documents } = useStoreon(
    'currentPointId',
    'documents'
  );
  const { id } = useParams();

  const getDoc = () => {
    const doc = documents.find(el => {
      return el.id === id;
    });
    if (!doc) return null;
    return doc;
  };

  const doc = getDoc();
  const { points } = doc;

  const currentPoint = points.find(point => point.id === currentPointId);

  React.useEffect(() => {
    return UIkit.util.on('#modal-container', 'hidden', () => {
      dispatch('currentPoint/setId', null);
    });
  }, []);

  const onNameSave = e => {
    dispatch('document/points/update', {
      docId: doc.id,
      point: {
        ...currentPoint,
        name: e.target.value
      }
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
            className={`${styles.title} uk-h4`}
            type="text"
            value={currentPoint && currentPoint.name ? currentPoint.name : ''}
            onChange={onNameSave}
          />
          <Options docId={doc.id} currentPoint={currentPoint} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
