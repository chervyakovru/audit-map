/* eslint-disable import/prefer-default-export */
import { useEffect } from 'react';

export const getRounded = number => Math.round(number * 100) / 100;

export const useOutsideClick = (ref, callback) => {
  const handleClick = e => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};

export const useKeyUp = callback => {
  useEffect(() => {
    document.addEventListener('keyup', callback);

    return () => {
      document.removeEventListener('keyup', callback);
    };
  });
};

export const notificationDate = date => {
  const minutes = date
    .getMinutes()
    .toString()
    .padStart(2, '0');
  const hours = date
    .getHours()
    .toString()
    .padStart(2, '0');
  const day = date.getDate();
  const monthNumber = date
    .getMonth()
    .toString()
    .padStart(2, '0');
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}.${monthNumber}.${year}`;
};
