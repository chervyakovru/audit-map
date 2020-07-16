import React from 'react';
import Violation from './Violation';
import Search from './Search';

import { getDisplayingViolations, getDisplayingText } from './utils';

const MOCK_VIOLATIONS = [
  {
    text:
      'Выход из помещения насосной выполнить непосредственно наружу, или на лестничную клетку имеющий выход непосредственно наружу. (осн. 4.2.2. СП 10.13130.2009)',
    id: 0,
  },
  {
    text:
      'Выполнить противопожарной 2-го типа дверь пожарной насосной (подвальный этаж). (осн. 4.2.2. СП 10.13130.2009)',
    id: 1,
  },
  {
    text:
      'Противопожарную дверь вентиляционной камеры (подвальный этаж поз.12) оборудовать устройством самозакрывания и аншлагом, на котором указать категорию по взрывопожарной опасности и класс зон по ПУЭ. (осн. п. 20. «Правила противопожарного режима в Российской Федерации» утверждены постановлением Правительства Российской Федерации» от 25 апреля 2012 г. N 390 «О противопожарном режиме»)',
    id: 2,
  },
];

const ELEMENTS_OFFSET = 20;

const Violations = () => {
  const [originViolations, setOriginViolations] = React.useState(MOCK_VIOLATIONS);
  const [searchValue, setSearchValue] = React.useState('');
  const [violationsIsLoaded, setViolationsIsLoaded] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [violations, setViolations] = React.useState([]);
  const [displayingViolations, setDisplayingViolations] = React.useState([]);
  const [visibleElementsCount, setVisibleElementsCount] = React.useState(ELEMENTS_OFFSET);
  const [editingId, setEditingId] = React.useState();
  const listRef = React.useRef(null);

  const fetchViolations = async () => {
    const fetchedViolations = originViolations.sort((a, b) => {
      const aIsSelected = selectedIds.includes(a.id);
      const bIsSelected = selectedIds.includes(b.id);
      if (aIsSelected && bIsSelected) return 0;
      if (aIsSelected) return -1;
      return 1;
    });

    setViolations(fetchedViolations);
    setDisplayingViolations(fetchedViolations);
    setViolationsIsLoaded(true);
  };

  React.useEffect(() => {
    fetchViolations();
  }, [originViolations]);

  const updateVisibleViolations = () => {
    if (searchValue.length === 0) {
      fetchViolations();
      setVisibleElementsCount(ELEMENTS_OFFSET);
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
    const newViolations = originViolations.map(v => (v.id === violationId ? { ...v, text: value } : v));
    setOriginViolations(newViolations);
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
      <div className="uk-margin-small-bottom">
        <Search value={searchValue} onValueChange={setSearchValue} />
      </div>
      <div uk-overflow-auto="true">
        {!violationsIsLoaded && (
          <div className="uk-position-center">
            <div uk-spinner="ratio: 2" />
          </div>
        )}
        {violationsIsLoaded &&
          (displayingViolations.length === 0 ? (
            <p>Нет совпадений</p>
          ) : (
            <ul ref={listRef} onScroll={onScroll} className="uk-list uk-list-divider uk-list-large">
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
          ))}
      </div>
    </>
  );
};

export default Violations;
