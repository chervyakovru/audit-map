import React from 'react';

import styles from './Violation.module.css';
import Textarea from './Textarea';

const Violation = ({
  text,
  displayingText,
  selected,
  isEditing,
  handleSelectChange,
  handleIsEditingChange,
  handleTextChange,
}) => {
  const [value, setValue] = React.useState(text);

  const handleContextMenu = e => {
    e.preventDefault();
    handleIsEditingChange(true, e);
  };
  const cancelEditing = () => {
    setValue(text);
    handleIsEditingChange(false);
  };
  const saveEditing = () => {
    handleIsEditingChange(false);
    handleTextChange(value);
  };
  const handleChange = event => {
    handleSelectChange(event.target.checked);
  };

  return (
    <li className={styles.listItem}>
      <label className={`${styles.label} uk-flex`} onContextMenu={handleContextMenu}>
        <div className={`${styles.checkboxWrap} ${isEditing && styles.checkboxWrapHidden}`}>
          <input
            className={`${styles.checkbox} uk-checkbox uk-flex-none`}
            checked={selected ?? false}
            onChange={handleChange}
            type="checkbox"
          />
        </div>
        <div className="uk-width-1-1 uk-flex">
          {isEditing ? (
            <Textarea value={value} onChange={setValue} cancelEditing={cancelEditing} saveEditing={saveEditing} />
          ) : (
            <p className={`${styles.text} uk-width-1-1 uk-margin-remove`}>{displayingText}</p>
          )}
          <button
            type="button"
            className={`${styles.saveButton} ${isEditing &&
              styles.saveButtonExpanded} uk-button uk-button-primary uk-flex-none`}
          >
            <span uk-icon="icon: check" />
          </button>
        </div>
      </label>
    </li>
  );
};

export default Violation;
