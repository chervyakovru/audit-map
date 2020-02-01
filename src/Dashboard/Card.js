import React from 'react';
import UIkit from 'uikit';
import { Link } from 'react-router-dom';
import useStoreon from 'storeon/react';
import { MdMoreHoriz } from 'react-icons/md';

import { useOutsideClick, notificationDate } from '../utils';

import styles from './Dashboard.module.css';

const Card = ({ doc }) => {
  const [selected, setSelected] = React.useState(false);
  const moreButtonRef = React.useRef();
  const dropdownRef = React.useRef();
  const { dispatch } = useStoreon('documents');

  useOutsideClick(moreButtonRef, () => setSelected(false));

  const onSelect = () => {
    setSelected(true);
  };

  const onDouble = e => {
    dispatch('document/duplicate', doc.id);
    UIkit.dropdown(dropdownRef.current).hide();
    setSelected(false);
    e.preventDefault();
    e.stopPropagation();
  };

  const onDelete = e => {
    dispatch('document/delete', doc.id);
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`${styles.card}
        uk-card
        uk-card-default
        uk-card-small
        uk-position-relative`}
      onMouseEnter={() => setSelected(true)}
      onMouseLeave={() => setSelected(false)}
    >
      <div
        className={`${styles.imageContainer}
          uk-position-relative
          uk-card-media-top`}
      >
        <img src={doc.thumbnailSrc} alt="map" />
        {selected && <div className={styles.imageOverlay} />}
      </div>
      <div className="uk-card-body uk-flex uk-flex-column">
        <p className="uk-margin-remove-bottom uk-text-truncate">{doc.name}</p>
        <small className="uk-text-truncate" style={{ height: '19px' }}>
          {selected && `Изменено ${notificationDate(doc.lastUpdate)}`}
        </small>
      </div>
      <Link
        to={`/board/${doc.id}`}
        className={`${styles.link} uk-link-reset`}
      />
      <button
        ref={moreButtonRef}
        type="button"
        onClick={onSelect}
        className={`
          ${styles.button}
          ${selected ? 'uk-display-block' : null}
          uk-position-z-index
          uk-button
          uk-button-link
          uk-padding-small
          uk-position-absolute
          uk-position-top-right`}
        uk-tooltip="title: Редактировать; delay: 1500"
      >
        <MdMoreHoriz size="25px" />
      </button>
      <div
        ref={dropdownRef}
        uk-dropdown="mode: click; offset: -10; delay-hide: 0"
        className={`
          ${styles.dropdown}
          uk-padding-remove-left
          uk-padding-remove-right
          uk-padding-small`}
      >
        <ul className={`${styles.dropdown} uk-nav uk-dropdown-nav`}>
          <li>
            <button type="button" className={styles.listElement}>
              Переименовать
            </button>
          </li>
          <li>
            <button
              onClick={onDouble}
              type="button"
              className={styles.listElement}
            >
              Дублировать
            </button>
          </li>
          <li className="uk-nav-divider uk-margin-remove" />
          <li>
            <button
              onClick={onDelete}
              type="button"
              className={styles.listElement}
            >
              Удалить
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Card;