import React from 'react';
import { Link } from 'react-router-dom';

import { GoPlusSmall } from 'react-icons/go';
import styles from './Dashboard.module.css';

const AddNewCard = () => (
  <Link to="/board/0" className="uk-link-reset">
    <div
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
  </Link>
);

export default AddNewCard;
