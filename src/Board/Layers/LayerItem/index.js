import React from 'react';
import useStoreon from 'storeon/react';
import UIkit from 'uikit';

import { useHistory, useParams } from 'react-router-dom';
import { ROUTES } from '../../../Consts';
import { getLayersCollection, getFileRef } from '../../../api';

import styles from '../Layers.module.css';
import EditLayerNameInput from './EditLayerNameInput';
import LayerName from './LayerName';

const LayerItem = ({ layer, isActiveLayer }) => {
  const history = useHistory();
  const { boardId } = useParams();
  const { user } = useStoreon('user');

  const [isEditing, setIsEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(layer.name);

  const navigateToLayer = () => {
    history.push(ROUTES.BOARD(boardId, layer.id));
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const onChange = e => setInputValue(e.target.value);

  const finishEditing = () => {
    const layerRef = getLayersCollection(user.uid, boardId).doc(layer.id);
    layerRef.update({ name: inputValue });

    setIsEditing(false);
  };

  const deleteLayer = () => {
    UIkit.modal
      .confirm(`Вы уверены, что хотите удалить слой ${layer.name}?`, {
        labels: { cancel: 'Отмена', ok: 'Да' },
        bgClose: true,
        escClose: true,
      })
      .then(() => {
        if (layer.mapName) {
          getFileRef(user.uid, boardId, layer.id, layer.mapName).delete();
        }
        getLayersCollection(user.uid, boardId)
          .doc(layer.id)
          .delete();
      });
  };

  return (
    <div
      className={`
        ${styles.button}
        ${isActiveLayer ? styles.activeButton : null}
        uk-text-left
        uk-padding-small
        uk-width-1-1
        uk-flex
      `}
      role="link"
      tabIndex={0}
      onKeyPress={() => {}}
      onClick={() => navigateToLayer(layer.id)}
      key={layer.id}
    >
      {isEditing ? (
        <EditLayerNameInput inputValue={inputValue} onChange={onChange} finishEditing={finishEditing} />
      ) : (
        <LayerName
          startEditing={startEditing}
          layerName={layer.name}
          isActiveLayer={isActiveLayer}
          deleteLayer={deleteLayer}
        />
      )}
    </div>
  );
};

export default LayerItem;
