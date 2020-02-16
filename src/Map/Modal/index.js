import React from 'react';
import { useHistory } from 'react-router-dom';
import { getPointRef } from '../../api';
import { useOutsideClick, useKeyUp } from '../../utils';

import Options from './Options';
import styles from './Modal.module.css';

const Modal = ({ docId, pointId }) => {
  const history = useHistory();
  const [point, setPoint] = React.useState({ data: null, loaded: false });
  const content = React.useRef(null);

  React.useEffect(() => {
    return getPointRef(docId, pointId).onSnapshot(snapshot => {
      const fetchedPoint = {
        ...snapshot.data(),
        id: snapshot.id
      };
      setPoint({ data: fetchedPoint, loaded: true });
    });
  }, [pointId]);

  const onRename = e => {
    const name = e.target.value;
    const pointRef = getPointRef(docId, point.data.id);
    pointRef.update({ name });
  };

  const closeModal = () => {
    history.goBack();
  };

  useOutsideClick(content, closeModal);

  const onKeyPress = e => {
    if (e.code === 'Escape') {
      closeModal();
    }
  };

  useKeyUp(onKeyPress);

  return (
    <div
      style={{ background: 'rgba(0,0,0,.3)' }}
      className="
        uk-position-fixed
        uk-position-cover
        uk-position-z-index
        uk-padding"
    >
      <div
        ref={content}
        className="
          uk-card
          uk-card-body
          uk-card-default
          uk-container
          uk-container-large
          uk-height-1-1
          uk-flex
          uk-flex-column
          uk-overflow-hidden"
      >
        <button
          onClick={closeModal}
          type="button"
          uk-close="true"
          className="uk-padding-small uk-position-top-right"
        />
        {!point.loaded ? (
          <div className="uk-position-center">
            <div uk-spinner="ratio: 2" />
          </div>
        ) : (
          <>
            <input
              className={`${styles.title} uk-h4 uk-margin-remove-top`}
              type="text"
              value={point.data.name}
              onChange={onRename}
            />
            <Options docId={docId} point={point.data} />
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
