/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import useStoreon from 'storeon/react';

import Option from './Option';

const Options = props => {
  const { dispatch, violations } = useStoreon('violations');

  const { currentPoint } = props;

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

  return (
    <>
      <form className="uk-search uk-search-default uk-width-1-1 uk-margin-bottom">
        <span uk-search-icon="true" />
        <input
          className="uk-search-input"
          type="search"
          placeholder="Введите 3 символа для начала поиска..."
        />
      </form>
      <div uk-overflow-auto="true">
        {violations.map(option => (
          <Option
            key={option.id}
            id={option.id}
            checked={option.checked}
            text={option.text}
            onChange={onSelectOption}
          />
        ))}
      </div>
    </>
  );
};

export default Options;
