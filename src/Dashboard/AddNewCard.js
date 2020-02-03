import React from 'react';
import useStoreon from 'storeon/react';

import { GoPlusSmall } from 'react-icons/go';
import styles from './Dashboard.module.css';

const AddNewCard = () => {
  const { dispatch } = useStoreon('documents');

  const createNewBoard = e => {
    dispatch('documents/addNew');
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      role="button"
      onClick={createNewBoard}
      onKeyPress={() => {}}
      tabIndex={0}
      className={`${styles.addNewCard}
        uk-card
        uk-card-primary
        uk-card-small
        uk-height-1-1`}
    >
      <div className="uk-position-center">
        <GoPlusSmall size={60} color="#fff" />
      </div>
      <p className="uk-position-small uk-position-bottom-center">
        Новый документ
      </p>
    </div>
  );
};

export default AddNewCard;
