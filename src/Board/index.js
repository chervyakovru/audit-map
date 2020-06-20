import React from 'react';
import { useParams } from 'react-router-dom';
import useStoreon from 'storeon/react';

import { getBoardsCollection, getLayersCollection } from '../api';

import DocInfoButton from '../DocInfoButtons';
import Layer from '../Layer';
import Layers from './Layers';

const Board = () => {
  const { boardId } = useParams();
  const { user } = useStoreon('user');

  const [doc, setDoc] = React.useState({ data: {}, loaded: false });
  const [layers, setLayers] = React.useState({ data: [], loaded: false });

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

  return (
    <>
      <DocInfoButton docTitle={`${doc.data.name}`} />
      <div className="uk-flex uk-height-1-1">
        <div className="uk-height-1-1 uk-width-1-1 uk-position-relative uk-background-muted">
          <Layer />
        </div>
        <div className="uk-flex-none" style={{ width: '480px' }}>
          <Layers layers={layers} />
        </div>
      </div>
    </>
  );
};

export default Board;
