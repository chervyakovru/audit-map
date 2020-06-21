import React from 'react';
import { useParams } from 'react-router-dom';
import useStoreon from 'storeon/react';
import { MdMenu, MdClose } from 'react-icons/md';

import { getBoardsCollection, getLayersCollection } from '../api';

import DocInfoButton from '../DocInfoButtons';
import Layer from '../Layer';
import Layers from './Layers';
import Button from '../Button';
import BoardPanel from '../BoardPanel';

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
  const contentWidth = isLayerOpen ? 100 - OPEN_LAYERS_WIDTH : 100;

  return (
    <>
      <DocInfoButton docTitle={`${doc.data.name}`} />
      <div className="uk-flex uk-height-1-1 uk-flex-stretch">
        <div
          className={`${styles.layersContainer} uk-width-1-1 uk-position-relative uk-background-muted`}
          style={{ width: `${contentWidth}vw` }}
        >
          <Layer />
          <BoardPanel disableZIndex position="top-right">
            <Button onClick={() => setIsLayerOpen(!isLayerOpen)}>
              {isLayerOpen ? <MdClose size="25px" /> : <MdMenu size="25px" />}
            </Button>
          </BoardPanel>
        </div>
        <div className={`${styles.layersContainer} uk-flex-none`} style={{ width: `${layersWidth}vw` }}>
          <div className="uk-height-1-1" style={{ width: `${OPEN_LAYERS_WIDTH}vw` }}>
            <Layers layers={layers} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Board;
