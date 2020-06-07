import React from 'react';
import { useParams } from 'react-router-dom';
import useStoreon from 'storeon/react';

import { getBoardsCollection, getLayersCollection } from '../api';

import DocInfoButton from '../DocInfoButtons';
import Layer from '../Layer';

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

  const activeLayer = layers.data.find(layer => layer.id === doc.data.lastOpenedLayer);

  return (
    <>
      <DocInfoButton boardId={boardId} layerId={activeLayer.id} docTitle={`${doc.data.name}/${activeLayer.name}`} />
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ width: '100%', height: '100%', position: 'relative', background: '#f8f8f8' }}>
          <Layer />
        </div>
        <div style={{ flex: 'none', width: '480px' }}>
          <div className="uk-padding-small">
            <h3 className="uk-margin-bottom">Слои</h3>
            {layers.data.map(layer => (
              <p key={layer.id}>{layer.name}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Board;
