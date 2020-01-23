/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import UIkit from 'uikit';
import useStoreon from 'storeon/react';
import firebase from '../firebase';

import Option from './Option';

const Options = props => {
  const [searchValue, setSearchValue] = React.useState('');
  const { dispatch, violations } = useStoreon('violations');
  const { currentPoint } = props;

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
    };
    fetchData();
  }, []);

  const onSelectOption = e => {
    const { target } = e;
    const value = target.checked;
    const { name } = target;

    if (!value) {
      dispatch('points/update', {
        ...currentPoint,
        violationsId: currentPoint.violationsId.filter(id => id !== name)
      });
    } else {
      const isContain = currentPoint.violationsId.find(id => id === name);
      if (!isContain) {
        dispatch('points/update', {
          ...currentPoint,
          violationsId: [...currentPoint.violationsId, name]
        });
      }
    }
  };

  const isChecked = optionId => {
    if (!currentPoint || !currentPoint.violationsId) return false;
    return currentPoint.violationsId.includes(optionId.toString());
  };

  return (
    <>
      <form className="uk-search uk-search-default uk-width-1-1 uk-margin-bottom">
        <span uk-search-icon="true" />
        <input
          className="uk-search-input"
          type="search"
          placeholder="Введите 3 символа для начала поиска..."
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
      </form>
      <div uk-overflow-auto="true">
        {violations.map(option => (
          <Option
            key={option.id}
            id={option.id}
            checked={isChecked(option.id)}
            text={option.text}
            onChange={onSelectOption}
          />
        ))}
      </div>
    </>
  );
};

export default Options;
