/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import UIkit from 'uikit';
import { getERCollection, getDocRef } from '../../Dashboard/api';

import Option from './Option';
import styles from './Modal.module.css';

const ELEMENTS_OFFSET = 20;

const Options = ({ selectedPoint, doc }) => {
  const [searchValue, setSearchValue] = React.useState('');
  const [violations, setViolations] = React.useState(null);
  const [visibleViolations, setVisibleViolations] = React.useState(null);
  const [visibleElementsCount, setVisibleElementsCount] = React.useState(
    ELEMENTS_OFFSET
  );

  React.useEffect(() => {
    return UIkit.util.on('#modal-container', 'hidden', () => {
      setSearchValue('');
    });
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const collection = getERCollection();
      const data = await collection.get();

      const fetchedViolations = data.docs.map(violation => ({
        id: violation.id,
        ...violation.data()
      }));

      setViolations(fetchedViolations);
      setVisibleViolations(fetchedViolations);
    };
    fetchData();
  }, []);

  const removeViolationId = (points, violationId) => {
    return points.map(point => {
      if (point.id !== selectedPoint.id) return point;
      return {
        ...point,
        violationsId: selectedPoint.violationsId.filter(
          id => id !== violationId
        )
      };
    });
  };

  const addViolationId = (points, violationId) => {
    return points.map(point => {
      if (point.id !== selectedPoint.id) return point;
      return {
        ...point,
        violationsId: [...selectedPoint.violationsId, violationId]
      };
    });
  };

  const onSelectOption = async e => {
    const { target } = e;
    const value = target.checked;
    const violationId = target.name;
    const { points } = doc;

    let newPoints = points;
    const isContain = selectedPoint.violationsId.find(id => id === violationId);

    if (!value) {
      if (!isContain) return;
      newPoints = removeViolationId(points, violationId);
    } else {
      if (isContain) return;
      newPoints = addViolationId(points, violationId);
    }

    const docRef = getDocRef(doc.id);
    docRef.update({
      points: newPoints
    });
  };

  const isChecked = optionId => {
    if (!selectedPoint || !selectedPoint.violationsId) return false;
    return selectedPoint.violationsId.includes(optionId.toString());
  };

  const updateVisibleViolations = value => {
    if (value.length === 0) {
      setVisibleViolations(violations);
      setVisibleElementsCount(ELEMENTS_OFFSET);
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

      const violationWithIndexes = {
        ...violation,
        foundIndexes: allEntry
      };
      return [...acc, violationWithIndexes];
    }, []);

    setVisibleViolations(search);
    setVisibleElementsCount(ELEMENTS_OFFSET);
  };

  React.useEffect(() => {
    updateVisibleViolations(searchValue);
  }, [searchValue]);

  const onChange = e => {
    const { value } = e.target;
    setSearchValue(value);
  };

  const getText = (text, foundIndexes, searchLength) => {
    if (searchLength === 0 || !foundIndexes || foundIndexes.length === 0)
      return <span>{text}</span>;

    const output = [text.slice(0, foundIndexes[0])];

    for (let i = 0; i < foundIndexes.length; i += 1) {
      const startMatch = foundIndexes[i];
      const endMatch = startMatch + searchLength;
      output.push(
        <>
          <span className={styles.selected}>
            {text.slice(startMatch, endMatch)}
          </span>
          {i < foundIndexes.length - 1
            ? text.slice(endMatch, foundIndexes[i + 1])
            : text.slice(endMatch)}
        </>
      );
    }
    return output;
  };

  const clearSearch = () => {
    setSearchValue('');
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
        {!visibleViolations && <div uk-spinner="true" />}
        {visibleViolations &&
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
