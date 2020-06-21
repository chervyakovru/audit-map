import React from 'react';
import { useParams } from 'react-router-dom';
import useStoreon from 'storeon/react';
import { MdMenu, MdClose } from 'react-icons/md';

import { getBoardsCollection, getLayersCollection } from '../api';

import DocInfoButton from '../DocInfoButtons';
import Layer from '../Layer';
import Layers from './Layers';
import Button from '../Button';
import styles from './Board.module.css';

const OPEN_LAYERS_WIDTH = 30;

const Board = () => {
  const { boardId } = useParams();
  const { user } = useStoreon('user');

  const [doc, setDoc] = React.useState({ data: {}, loaded: false });
  const [layers, setLayers] = React.useState({ data: [], loaded: false });
  const [isLayerOpen, setIsLayerOpen] = React.useState(false);

  React.useEffect(() => {
    return getBoardsCollection(user.uid)
      .doc(boardId)
      .onSnapshot(boardsSnapshot => {
        const fetchedDocument = {
          ...boardsSnapshot.data(),
          id: boardsSnapshot.id,
        };
        setDoc({ data: fetchedDocument, loaded: true });
      });
  }, []);

  React.useEffect(() => {
    getLayersCollection(user.uid, boardId).onSnapshot(layersSnapshot => {
      const fetchedLayers = layersSnapshot.docs.map(layer => ({
        ...layer.data(),
        id: layer.id,
      }));
      setLayers({ data: fetchedLayers, loaded: true });
    });
  }, []);

  if (!doc.loaded || !layers.loaded) {
    return (
      <div className="main">
        <div className="uk-position-center uk-text-center">
          <div uk-spinner="ratio: 2" />
        </div>
      </div>
    );
  }

  const layersWidth = isLayerOpen ? OPEN_LAYERS_WIDTH : 0;

  return (
    <>
      <DocInfoButton docTitle={`${doc.data.name}`} />
      <div className="uk-flex uk-height-1-1">
        <div className="uk-height-1-1 uk-width-1-1 uk-position-relative uk-background-muted">
          <Layer />
        </div>
        <div className="uk-position-relative uk-height-1-1 uk-flex-none">
          <div
            className={`
                ${styles.menuButton}
                uk-position-absolute
                uk-card
                uk-card-body
                uk-card-default
                uk-flex
                uk-padding-remove
                `}
          >
            <Button onClick={() => setIsLayerOpen(!isLayerOpen)}>
              {isLayerOpen ? <MdClose size="25px" /> : <MdMenu size="25px" />}
            </Button>
          </div>
          <div className={`${styles.layersContainer} uk-height-1-1 uk-flex-none`} style={{ width: `${layersWidth}vw` }}>
            <div className="uk-height-1-1" style={{ width: `${OPEN_LAYERS_WIDTH}vw` }}>
              <Layers layers={layers} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Board;
