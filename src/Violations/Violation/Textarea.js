import React from 'react';

import styles from './Violation.module.css';

const TEXTAREA_PADDING = 2;

const Textarea = ({ value, onChange, cancelEditing, saveEditing }) => {
  const textareaRef = React.useRef(null);

  React.useEffect(() => {
    function clickListener(event) {
      if (!textareaRef.current || textareaRef.current.contains(event.target)) {
        return;
      }
      cancelEditing();
    }

    function keyDownListener(event) {
      if (event.key === 'Escape') {
        cancelEditing();
      }
    }

    document.addEventListener('mousedown', clickListener);
    document.addEventListener('touchstart', clickListener);
    document.addEventListener('keydown', keyDownListener);

    return () => {
      document.removeEventListener('mousedown', clickListener);
      document.removeEventListener('touchstart', clickListener);
      document.removeEventListener('keydown', keyDownListener);
    };
  }, [textareaRef, cancelEditing]);

  React.useEffect(() => {
    if (!textareaRef.current) {
      return;
    }
    const height = `${String(textareaRef.current.scrollHeight + TEXTAREA_PADDING)}px`;
    textareaRef.current.style.minHeight = height;
    textareaRef.current.focus();
  }, []);

  const handleChange = event => onChange(event.target.value);
  const handleKeyDown = event => (event.ctrlKey && event.key === 'Enter' ? saveEditing() : null);

  return (
    <textarea
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      value={value}
      ref={textareaRef}
      className={`${styles.textarea} uk-textarea uk-width-1-1`}
      name="violation"
    />
  );
};

export default Textarea;
