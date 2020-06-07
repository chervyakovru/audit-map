import React from 'react';
import useStoreon from 'storeon/react';
import UIkit from 'uikit';

import { useHistory, useParams } from 'react-router-dom';
import { MdAddBox } from 'react-icons/md';
import { ROUTES } from '../../Consts';
import { fbTimestamp, getBoardsCollection, getLayersCollection, getFileRef } from '../../api';

import styles from './Layers.module.css';

const Layers = ({ layers }) => {
  const history = useHistory();
  const { boardId, layerId } = useParams();
  const { user } = useStoreon('user');

  const [editableLayer, setEditableLayer] = React.useState({ id: null, name: '' });

  const navigateToLayer = id => {
    history.push(ROUTES.BOARD(boardId, id));
  };

  const startEditLayerName = (id, name) => {
    setEditableLayer({ id, name });
  };

  const onChange = e => setEditableLayer({ ...editableLayer, name: e.target.value });

  const startEditLayerNameFuncGetter = (id, name) => {
    return e => {
      e.preventDefault();
      e.stopPropagation();

      startEditLayerName(id, name);
    };
  };

  const closeEditing = () => {
    const layerRef = getLayersCollection(user.uid, boardId).doc(editableLayer.id);
    const boardRef = getBoardsCollection(user.uid).doc(boardId);
    boardRef.update({ lastOpenedLayer: editableLayer.id });

    layerRef.update({ name: editableLayer.name });
    setEditableLayer({ id: null, name: '' });
  };

  const addLayer = () => {
    const boardRef = getBoardsCollection(user.uid).doc(boardId);

    boardRef
      .collection('layers')
      .add({ name: 'Новый слой', lastUpdate: fbTimestamp })
      .then(layerRef => {
        boardRef.update({ lastOpenedLayer: layerRef.id });
      });
  };

  const deleteLayer = (id, name, mapName) => {
    UIkit.modal
      .confirm(`Вы уверены, что хотите удалить слой ${name}?`, {
        labels: { cancel: 'Отмена', ok: 'Да' },
        bgClose: true,
        escClose: true,
      })
      .then(() => {
        if (mapName) {
          getFileRef(user.uid, boardId, layerId, mapName).delete();
        }
        getLayersCollection(user.uid, boardId)
          .doc(id)
          .delete();
      });
  };

  return (
    <div
      className={`
      uk-padding-small
      uk-flex
      uk-flex-column
      uk-flex-between uk-height-1-1
    `}
    >
      <div className="uk-margin-small-bottom" style={{ overflow: 'auto' }}>
        <h3 className="uk-margin-bottom">Слои</h3>
        {layers.data.map(layer => {
          const isActiveLayout = layerId === layer.id;
          const isEditableLayout = editableLayer.id === layer.id;
          return (
            <div
              className={`
              ${styles.button}
              ${isActiveLayout ? styles.activeButton : null}
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
              {isEditableLayout && (
                <div
                  className={`
                  uk-width-1-1
                  uk-flex
                  uk-flex-between
                  uk-flex-middle
                  uk-position-relative
                `}
                >
                  <input
                    className={styles.editLayerName}
                    type="text"
                    placeholder="Введите название слоя..."
                    value={editableLayer.name}
                    onChange={onChange}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                  />
                  <span
                    onKeyPress={() => {}}
                    role="button"
                    tabIndex={0}
                    className={`${styles.editIcon}`}
                    onClick={closeEditing}
                    uk-icon="icon: check"
                  />
                </div>
              )}
              {!isEditableLayout && (
                <div className="uk-width-1-1 uk-flex uk-flex-between uk-flex-middle">
                  {layer.name}
                  <div>
                    <span
                      onKeyPress={() => {}}
                      role="button"
                      tabIndex={0}
                      className={styles.editIcon}
                      onClick={startEditLayerNameFuncGetter(layer.id, layer.name)}
                      uk-icon="icon: pencil"
                    />
                    {!isActiveLayout && (
                      <span
                        onKeyPress={() => {}}
                        role="button"
                        tabIndex={0}
                        className={`${styles.deleteIcon} uk-margin-small-left`}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();

                          deleteLayer(layer.id, layer.name, layer.mapName);
                        }}
                        uk-icon="icon: trash"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
        key={0}
      >
        <span className="uk-margin-small-right">
          <MdAddBox size="25px" />
        </span>{' '}
        Добавить слой
      </button>
    </div>
  );
};

export default Layers;
