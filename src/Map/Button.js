import React from 'react';
import styles from './Map.module.css';

const Button = props => {
  const { onClick, tooltip, disabled, children } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.button} uk-button uk-button-link uk-padding-small`}
      uk-tooltip={`title: ${tooltip}; delay: 1500`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
