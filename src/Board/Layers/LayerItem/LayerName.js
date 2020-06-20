import React from 'react';

import { MdModeEdit, MdDelete } from 'react-icons/md';

import styles from '../Layers.module.css';

function isEllipsisActive(element) {
  const { offsetWidth, scrollWidth } = element;
  return scrollWidth > offsetWidth;
}

const LayerName = ({ startEditing, layerName, isActiveLayer, deleteLayer }) => {
  const layerNameRef = React.useRef(null);
  const [isLongName, setIsLongName] = React.useState(null);

  React.useEffect(() => {
    setIsLongName(isEllipsisActive(layerNameRef.current));
  }, [layerName]);

  return (
    <div className="uk-width-1-1 uk-flex uk-flex-between uk-flex-middle">
      <div
        ref={layerNameRef}
        uk-tooltip={isLongName ? layerName : ''}
        className="uk-margin-small-right uk-flex-1 uk-text-truncate"
      >
        {layerName}
      </div>
      <div>
        <span
          onKeyPress={() => {}}
          role="button"
          tabIndex={0}
          className={styles.editIcon}
          onClick={e => {
            e.stopPropagation();
            startEditing();
          }}
        >
          <MdModeEdit size="25px" />
        </span>
        {!isActiveLayer && (
          <span
            onKeyPress={() => {}}
            role="button"
            tabIndex={0}
            className={`${styles.deleteIcon} uk-margin-small-left`}
            onClick={e => {
              e.stopPropagation();
              deleteLayer();
            }}
          >
            <MdDelete size="25px" />
          </span>
        )}
      </div>
    </div>
  );
};

export default LayerName;
