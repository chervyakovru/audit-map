import React from 'react';

import { GoPlusSmall } from 'react-icons/go';
import { fbTimestamp, getDocumentsCollection } from '../api';

import initialDocument from './initialDocument';

import styles from './Dashboard.module.css';

const AddNewCard = () => {
  const createNewBoard = () => {
    const collection = getDocumentsCollection();

    collection
      .add({
        ...initialDocument,
        lastUpdate: fbTimestamp
      })
      .then(docRef => {
        console.log('Document written with ID: ', docRef.id);
      })
      .catch(error => {
        console.error('Error adding document: ', error);
      });
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
        uk-height-medium`}
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
