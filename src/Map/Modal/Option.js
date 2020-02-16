/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import styles from './Modal.module.css';

const Option = props => {
  const { id, checked, text, onChange } = props;
  return (
    <div className="uk-margin-small-bottom">
      <label className={`${styles.option} uk-flex uk-flex-start`}>
        <input
          className={`${styles.checkbox} uk-flex-none uk-checkbox uk-margin-right`}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          name={id}
        />
        <span>{text}</span>
      </label>
    </div>
  );
};

export default Option;
