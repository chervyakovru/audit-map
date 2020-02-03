/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import UIkit from 'uikit';
import useStoreon from 'storeon/react';
import firebase from '../../firebase';

import Option from './Option';
import styles from './Modal.module.css';

const ELEMENTS_OFFSET = 20;

const Options = props => {
  const [searchValue, setSearchValue] = React.useState('');
  const [violationsLoaded, setViolationsLoaded] = React.useState(false);
  const [visibleViolations, setVisibleViolations] = React.useState(null);
  const [visibleElementsCount, setVisibleElementsCount] = React.useState(
    ELEMENTS_OFFSET
  );
  const { dispatch, violations } = useStoreon('violations', 'documents');
  const { currentPoint, docId } = props;

  React.useEffect(() => {
    return UIkit.util.on('#modal-container', 'hidden', () => {
      setSearchValue('');
    });
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const db = firebase.firestore();
      const data = await db.collection('expertReport').get();

      const fetchViolations = data.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      dispatch('violations/set', fetchViolations);
      const search = fetchViolations.map(violation => ({
        ...violation,
        foundIndexes: []
      }));

      setVisibleViolations(search);
      setViolationsLoaded(true);
    };
    fetchData();
  }, []);

  const onSelectOption = e => {
    const { target } = e;
    const value = target.checked;
    const { name } = target;

    if (!value) {
      dispatch('document/points/update', {
        docId,
        point: {
          ...currentPoint,
          violationsId: currentPoint.violationsId.filter(id => id !== name)
        }
      });
    } else {
      const isContain = currentPoint.violationsId.find(id => id === name);

      if (!isContain) {
        dispatch('document/points/update', {
          docId,
          point: {
            ...currentPoint,
            violationsId: [...currentPoint.violationsId, name]
          }
        });
      }
    }
  };

  const isChecked = optionId => {
    if (!currentPoint || !currentPoint.violationsId) return false;
    return currentPoint.violationsId.includes(optionId.toString());
  };

  const updateVisibleViolations = value => {
    if (value.length === 0) {
      setVisibleViolations(violations);
      return;
    }
    const valueTLC = value.toLowerCase();
    const search = violations.reduce((acc, violation) => {
      const textTLC = violation.text.toLowerCase();
      let currentIndex = 0;
      let indexFound = textTLC.indexOf(valueTLC, currentIndex);
      if (indexFound === -1) {
        return acc;
      }
      currentIndex = indexFound + value.length;
      // ищем все вхождения
      const allEntry = [];
      do {
        allEntry.push(indexFound);
        indexFound = textTLC.indexOf(valueTLC, currentIndex);
        currentIndex = indexFound + value.length;
      } while (indexFound !== -1);
      return [
        ...acc,
        {
          ...violation,
          foundIndexes: allEntry
        }
      ];
    }, []);

    setVisibleViolations(search);
    setVisibleElementsCount(ELEMENTS_OFFSET);
  };

  const onChange = e => {
    const { value } = e.target;
    setSearchValue(value);
    updateVisibleViolations(value);
  };

  const getText = (text, foundIndexes, searchLength) => {
    if (searchLength === 0) return <span>{text}</span>;

    const output = [text.slice(0, foundIndexes[0])];
    for (let i = 0; i < foundIndexes.length; i += 1) {
      output.push(
        <>
          <span className={styles.selected}>
            {text.slice(foundIndexes[i], foundIndexes[i] + searchLength)}
          </span>
          {i < foundIndexes.length - 1
            ? text.slice(foundIndexes[i] + searchLength, foundIndexes[i + 1])
            : text.slice(foundIndexes[i] + searchLength)}
        </>
      );
    }
    return output;
  };

  const clearSearch = () => {
    setSearchValue('');
    updateVisibleViolations('');
  };

  const onScroll = e => {
    const el = e.target;
    if (el.scrollHeight - el.scrollTop === el.clientHeight) {
      setVisibleElementsCount(visibleElementsCount + ELEMENTS_OFFSET);
    }
  };

  return (
    <>
      <form className="uk-search uk-search-default uk-width-1-1 uk-margin-bottom">
        <span uk-search-icon="true" />
        <input
          className="uk-search-input"
          type="search"
          placeholder="Поиск..."
          value={searchValue}
          onChange={onChange}
        />
        {searchValue.length !== 0 && (
          <button
            id="clear-search"
            type="button"
            className="uk-position-center-right uk-padding-small"
            uk-close="true"
            onClick={clearSearch}
          />
        )}
      </form>
      <div uk-overflow-auto="true" onScroll={onScroll}>
        {!violationsLoaded && <div uk-spinner="true" />}
        {violationsLoaded &&
          (visibleViolations.length === 0 ? (
            <p>Нет совпадений</p>
          ) : (
            visibleViolations.slice(0, visibleElementsCount).map(option => {
              const text = getText(
                option.text,
                option.foundIndexes,
                searchValue.length
              );
              return (
                <Option
                  key={`${searchValue}_${option.id}`}
                  id={option.id}
                  checked={isChecked(option.id)}
                  text={text}
                  onChange={onSelectOption}
                />
              );
            })
          ))}
      </div>
    </>
  );
};

export default Options;
