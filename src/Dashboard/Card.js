import React from 'react';
import UIkit from 'uikit';
import { useHistory } from 'react-router-dom';
import useStoreon from 'storeon/react';

import { MdMoreHoriz } from 'react-icons/md';
import { AiOutlineFileImage } from 'react-icons/ai';

import { fbTimestamp, getBoardsCollection, getFileRef } from '../api';
import { useOutsideClick, notificationDate } from '../utils';
import { ROUTES } from '../Consts';

import styles from './Dashboard.module.css';

const Card = ({ doc }) => {
  const history = useHistory();
  const { user } = useStoreon('user');

  const [selected, setSelected] = React.useState(false);
  const [thumbnail, setThumbnail] = React.useState({
    data: null,
    loaded: false,
    isExist: false
  });
  const moreButtonRef = React.useRef();
  const dropdownRef = React.useRef();

  React.useEffect(() => {
    if (!doc.thumbnail) {
      setThumbnail({ data: null, loaded: true, exist: false });
      return;
    }
    getFileRef(user.uid, doc.id, doc.thumbnail)
      .then(url => {
        setThumbnail({ data: url, loaded: true, exist: true });
      })
      .catch(error => {
        console.log('error: ', error);
        setThumbnail({ data: null, loaded: true, exist: false });
      });
  }, []);

  useOutsideClick(moreButtonRef, () => setSelected(false));

  const onSelect = e => {
    e.preventDefault();
    e.stopPropagation();

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
      .then(name => {
        const documentRef = getBoardsCollection(user.uid).doc(doc.id);
        documentRef.update({ name });
      });
  };
  const onDouble = e => {
    e.preventDefault();
    e.stopPropagation();
    UIkit.dropdown(dropdownRef.current).hide();
    setSelected(false);

    // TODO realize deep copy (copy map image and dots)
    const collection = getBoardsCollection(user.uid);
    collection.add({
      name: `${doc.name} (Копия)`,
      lastUpdate: fbTimestamp
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
      .then(() => {
        getBoardsCollection(user.uid)
          .doc(doc.id)
          .delete();
      });
  };
  const goTo = () => {
    history.push(ROUTES.BOARD(doc.id));
  };

  const lastUpdateDate = doc.lastUpdate ? doc.lastUpdate.toDate() : new Date();

  return (
    <div
      className={`
        ${styles.card}
        uk-card
        uk-card-default
        uk-card-small
        uk-height-medium
        uk-position-relative`}
      onMouseEnter={() => setSelected(true)}
      onMouseLeave={() => setSelected(false)}
      onClick={goTo}
      role="button"
      tabIndex={0}
      onKeyPress={() => {}}
    >
      <div
        className={`
          ${styles.imageContainer}
          uk-position-relative
          uk-card-media-top`}
      >
        {thumbnail.loaded && thumbnail.data ? (
          <img src={thumbnail.data} alt="Map thumbnail" />
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
