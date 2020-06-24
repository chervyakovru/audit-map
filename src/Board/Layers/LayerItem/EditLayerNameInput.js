import React from 'react';
import { MdCheck } from 'react-icons/md';

import styles from '../Layers.module.css';

const EditLayerNameInput = ({ inputValue, onChange, finishEditing }) => {
  return (
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
        className={`${styles.editLayerNameInput} uk-flex-1 uk-margin-small-right`}
        onClick={e => e.stopPropagation()}
        type="text"
        placeholder="Введите название слоя..."
        value={inputValue}
        onChange={onChange}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
      <span
        onKeyPress={() => {}}
        role="button"
        tabIndex={0}
        className={`${styles.editIcon}`}
        onClick={e => {
          e.stopPropagation();
          finishEditing();
        }}
      >
        <MdCheck size="25px" />
      </span>
    </div>
  );
};

export default EditLayerNameInput;
