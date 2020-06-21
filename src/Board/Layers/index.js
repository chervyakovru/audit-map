import React from 'react';
import useStoreon from 'storeon/react';

import { useParams } from 'react-router-dom';
import { MdAddCircleOutline } from 'react-icons/md';
import { fbTimestamp, getBoardsCollection } from '../../api';

import styles from './Layers.module.css';
import LayerItem from './LayerItem';

const Layers = ({ layers }) => {
  const { boardId, layerId } = useParams();
  const { user } = useStoreon('user');

  const addLayer = () => {
    const boardRef = getBoardsCollection(user.uid).doc(boardId);

    boardRef.collection('layers').add({ name: 'Новый слой', lastUpdate: fbTimestamp });
  };

  return (
    <div
      className={`
      uk-padding-small
      uk-flex
      uk-flex-column
      uk-flex-between
      uk-height-1-1
    `}
    >
      <div className="uk-margin-small-bottom" style={{ overflow: 'auto' }}>
        <h3 className="uk-margin-bottom">Слои</h3>
        {layers.data.map(layer => (
          <LayerItem key={layer.id} layer={layer} isActiveLayer={layerId === layer.id} />
        ))}
      </div>
      <button
        className={`
          ${styles.button}
          uk-text-left
          uk-padding-small
          uk-background-default
          uk-width-1-1
          uk-flex
          uk-flex-middle
        `}
        type="button"
        onClick={addLayer}
      >
        <span className="uk-margin-small-right">
          <MdAddCircleOutline size="25px" />
        </span>
        Добавить слой
      </button>
    </div>
  );
};

export default Layers;
