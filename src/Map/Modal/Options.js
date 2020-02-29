import React from 'react';
import { getPointsCollection, getERCollection } from '../../api';

import Option from './Option';
import styles from './Modal.module.css';

const ELEMENTS_OFFSET = 20;

const Options = ({ userId, docId, point }) => {
  const [searchValue, setSearchValue] = React.useState('');
  const [violations, setViolations] = React.useState(null);
  const [visibleViolations, setVisibleViolations] = React.useState(null);
  const [visibleElementsCount, setVisibleElementsCount] = React.useState(
    ELEMENTS_OFFSET
  );

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

  const removeViolationId = violationId => {
    const pointRef = getPointsCollection(userId, docId).doc(point.id);
    const newViolationsId = point.violationsId.filter(id => id !== violationId);
    pointRef.update({
      violationsId: newViolationsId
    });
  };

  const addViolationId = violationId => {
    const pointRef = getPointsCollection(userId, docId).doc(point.id);
    const newViolationsId = [...point.violationsId, violationId];
    pointRef.update({
      violationsId: newViolationsId
    });
  };

  const onSelectOption = async e => {
    const { target } = e;
    const { checked, name: violationId } = target;

    const isContain = point.violationsId.find(id => id === violationId);

    if (!checked) {
      if (!isContain) return;
      removeViolationId(violationId);
    } else {
      if (isContain) return;
      addViolationId(violationId);
    }
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
    setSearchValue(e.target.value);
  };

  const isChecked = optionId => {
    return point.violationsId.includes(optionId.toString());
  };

  const getText = (text, foundIndexes, searchLength) => {
    if (searchLength === 0 || !foundIndexes || foundIndexes.length === 0) {
      return text;
    }
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
            type="button"
            className="uk-position-center-right uk-padding-small"
            uk-close="true"
            onClick={clearSearch}
          />
        )}
      </form>
      <div
        className="uk-flex uk-flex-column"
        uk-overflow-auto="true"
        onScroll={onScroll}
      >
        {!visibleViolations && (
          <div className="uk-position-center">
            <div uk-spinner="ratio: 2" />
          </div>
        )}
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
