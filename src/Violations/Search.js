import React from 'react';

const Search = ({ value, onValueChange }) => {
  const inputIconRef = React.useRef(null);

  const onChange = event => onValueChange(event.target.value);
  const onSearchIconClick = () => inputIconRef.current?.focus();
  const onClearIconClick = () => onValueChange('');

  return (
    <div className="uk-grid-small uk-flex-middle" uk-grid="true">
      <div className="uk-width-expand">
        <form className="uk-search uk-search-navbar uk-width-1-1 uk-flex uk-flex-middle">
          <span
            tabIndex={0}
            role="button"
            onKeyDown={() => {}}
            onClick={onSearchIconClick}
            className={` uk-flex-none uk-margin-small-right`}
            uk-icon="icon: search; ratio: 1.2"
          />
          <input
            ref={inputIconRef}
            onChange={onChange}
            value={value}
            className="uk-search-input"
            type="search"
            placeholder="Поиск..."
          />
        </form>
      </div>
      <div className="uk-width-auto">
        <button onClick={onClearIconClick} className="uk-navbar-dropdown-close" type="button" uk-close="true" />
      </div>
    </div>
  );
};

export default Search;
