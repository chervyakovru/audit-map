import React from 'react';
import UIkit from 'uikit';
import { Link } from 'react-router-dom';

import { MdMoreHoriz } from 'react-icons/md';
import { AiOutlineFileImage } from 'react-icons/ai';

import { getDocCollection, getDocRef, getFbTimestamp } from './api';
import { useOutsideClick, notificationDate } from '../utils';

import styles from './Dashboard.module.css';

const Card = ({ doc }) => {
  const [selected, setSelected] = React.useState(false);
  const moreButtonRef = React.useRef();
  const dropdownRef = React.useRef();

  useOutsideClick(moreButtonRef, () => setSelected(false));

  const onSelect = () => {
    setSelected(true);
  };

  const onRename = e => {
    e.preventDefault();
    e.stopPropagation();
    UIkit.dropdown(dropdownRef.current).hide();
    setSelected(false);

    UIkit.modal
      .prompt('Название документа:', doc.name, {
        labels: { cancel: 'Отмена', ok: 'Сохранить' },
        bgClose: true,
        escClose: true
      })
      .then(
        name => {
          const documentRef = getDocRef(doc.id);

          documentRef
            .update({ name })
            .then(() => {
              console.log('Document successfully updated!');
            })
            .catch(error => {
              console.error('Error updating document: ', error);
            });
        },
        () => {
          console.log('Canceled rename document');
        }
      );
  };

  const onDouble = e => {
    e.preventDefault();
    e.stopPropagation();
    UIkit.dropdown(dropdownRef.current).hide();
    setSelected(false);

    const collection = getDocCollection();

    const { id, ...docWithoutId } = doc;
    collection
      .add({
        ...docWithoutId,
        name: `${doc.name} (Копия)`,
        lastUpdate: getFbTimestamp()
      })
      .then(docRef => {
        console.log('Document written with ID: ', docRef.id);
      })
      .catch(error => {
        console.error('Error adding document: ', error);
      });
  };

  const onDelete = e => {
    e.preventDefault();
    e.stopPropagation();
    UIkit.dropdown(dropdownRef.current).hide();
    setSelected(false);

    UIkit.modal
      .confirm('Вы уверены, что хотите удалить проект?', {
        labels: { cancel: 'Отмена', ok: 'Да' },
        bgClose: true,
        escClose: true
      })
      .then(
        () => {
          const collection = getDocCollection();
          collection
            .doc(doc.id)
            .delete()
            .then(() => {
              console.log('Document successfully deleted!');
            })
            .catch(error => {
              console.error('Error adding document: ', error);
            });
        },
        () => {
          console.log('Canceled delete document');
        }
      );
  };

  const lastUpdateDate = doc.lastUpdate ? doc.lastUpdate.toDate() : new Date();

  return (
    <div
      className={`
        uk-card
        uk-card-default
        uk-card-small
        uk-height-medium
        uk-position-relative`}
      onMouseEnter={() => setSelected(true)}
      onMouseLeave={() => setSelected(false)}
    >
      <div
        className={`
          ${styles.imageContainer}
          uk-position-relative
          uk-card-media-top`}
      >
        {doc.image ? (
          <img src={doc.image} alt="map" />
        ) : (
          <div className="uk-position-center">
            <AiOutlineFileImage size="80px" />
          </div>
        )}
        {selected && <div className={styles.imageOverlay} />}
      </div>
      <div className="uk-card-body uk-flex uk-flex-column">
        <p className="uk-margin-remove-bottom uk-text-truncate">{doc.name}</p>
        <small className="uk-text-truncate" style={{ height: '19px' }}>
          {selected && `Изменено ${notificationDate(lastUpdateDate)}`}
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
            <button
              onClick={onRename}
              type="button"
              className={styles.listElement}
            >
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
              className={`${styles.listElement} uk-text-danger`}
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
