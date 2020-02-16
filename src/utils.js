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

const shortMonthNames = [
  'Янв',
  'Фев',
  'Март',
  'Апр',
  'Май',
  'Июнь',
  'Июль',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек'
];

export const notificationDate = date => {
  const day = date.getDate();
  const monthNumber = date.getMonth();
  const month = shortMonthNames[monthNumber];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};
