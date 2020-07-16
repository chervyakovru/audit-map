import React from 'react';
import styles from './Violations.module.css';

export const getDisplayingViolations = (searchValue, violations) => {
  const valueTLC = searchValue.toLowerCase();
  return violations.reduce((acc, violation) => {
    const textTLC = violation.text.toLowerCase();
    let currentIndex = 0;
    let indexFound = textTLC.indexOf(valueTLC, currentIndex);
    if (indexFound === -1) {
      return acc;
    }
    currentIndex = indexFound + searchValue.length;
    // ищем все вхождения
    const allEntry = [];
    do {
      allEntry.push(indexFound);
      indexFound = textTLC.indexOf(valueTLC, currentIndex);
      currentIndex = indexFound + searchValue.length;
    } while (indexFound !== -1);

    const violationWithIndexes = {
      ...violation,
      foundIndexes: allEntry,
    };
    return [...acc, violationWithIndexes];
  }, []);
};

export const getDisplayingText = (text, searchValueLength, foundIndexes) => {
  if (searchValueLength === 0 || !foundIndexes || foundIndexes.length === 0) {
    return text;
  }
  const output = [text.slice(0, foundIndexes[0])];

  for (let i = 0; i < foundIndexes.length; i += 1) {
    const startMatch = foundIndexes[i];
    const endMatch = startMatch + searchValueLength;
    output.push(
      <>
        <span className={styles.selected}>{text.slice(startMatch, endMatch)}</span>
        {i < foundIndexes.length - 1 ? text.slice(endMatch, foundIndexes[i + 1]) : text.slice(endMatch)}
      </>
    );
  }
  return output;
};
