import React from 'react';
import Violation from './Violation';
import Search from './Search';

import { getDisplayingViolations, getDisplayingText } from './utils';

const ELEMENTS_OFFSET = 20;

const Violations = ({ originViolations, handleOriginTextChange }) => {
  const [searchValue, setSearchValue] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [violations, setViolations] = React.useState([]);
  const [displayingViolations, setDisplayingViolations] = React.useState([]);
  const [visibleElementsCount, setVisibleElementsCount] = React.useState(ELEMENTS_OFFSET);
  const [editingId, setEditingId] = React.useState();
  const listRef = React.useRef(null);

  const initializeViolations = async () => {
    if (!originViolations) {
      setViolations([]);
      setDisplayingViolations([]);
      return;
    }
    const fetchedViolations = originViolations.sort((a, b) => {
      const aIsSelected = selectedIds.includes(a.id);
      const bIsSelected = selectedIds.includes(b.id);
      if (aIsSelected && bIsSelected) return 0;
      if (aIsSelected) return -1;
      return 1;
    });

    setViolations(fetchedViolations);
    setDisplayingViolations(fetchedViolations);
    setVisibleElementsCount(ELEMENTS_OFFSET);
  };

  React.useEffect(() => {
    initializeViolations();
  }, [originViolations]);

  const updateVisibleViolations = () => {
    if (searchValue.length === 0) {
      initializeViolations();
      return;
    }
    const newDisplayingViolations = getDisplayingViolations(searchValue, violations);
    setDisplayingViolations(newDisplayingViolations);
    setVisibleElementsCount(ELEMENTS_OFFSET);
  };

  React.useEffect(() => {
    updateVisibleViolations();
  }, [searchValue]);

  const handleIsEditingChange = id => value => (value ? setEditingId(id) : setEditingId(undefined));

  const addViolationId = violationId => setSelectedIds([violationId, ...selectedIds]);
  const removeViolationId = violationId => setSelectedIds(selectedIds.filter(i => i !== violationId));

  const handleSelectChange = id => value => (value ? addViolationId(id) : removeViolationId(id));
  const handleTextChange = violationId => value => {
    handleOriginTextChange(violationId, value);
  };

  const onScroll = () => {
    if (!listRef.current) {
      return;
    }
    const { scrollHeight, scrollTop, clientHeight } = listRef.current;
    if (scrollHeight - scrollTop === clientHeight) {
      setVisibleElementsCount(visibleElementsCount + ELEMENTS_OFFSET);
    }
  };

  const isEditing = id => editingId === id;
  const isSelected = id => selectedIds.includes(id);

  return (
    <>
      <Search value={searchValue} onValueChange={setSearchValue} />
      {displayingViolations.length === 0 ? (
        <p>Нет совпадений. Позже тут появиться возможность добавить новое нарушение</p>
      ) : (
        <ul ref={listRef} uk-overflow-auto="true" onScroll={onScroll} className="uk-list uk-list-divider uk-list-large">
          {displayingViolations.slice(0, visibleElementsCount).map(violation => {
            const text = getDisplayingText(violation.text, searchValue.length, violation.foundIndexes);
            return (
              <Violation
                key={violation.id}
                displayingText={text}
                text={violation.text}
                selected={isSelected(violation.id)}
                isEditing={isEditing(violation.id)}
                handleSelectChange={handleSelectChange(violation.id)}
                handleIsEditingChange={handleIsEditingChange(violation.id)}
                handleTextChange={handleTextChange(violation.id)}
              />
            );
          })}
        </ul>
      )}
    </>
  );
};

export default Violations;
