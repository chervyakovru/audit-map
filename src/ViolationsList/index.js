import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Violation from './Violation';
import CustomContextMenu from '../CustomContextMenu';

import { getDisplayingViolations, getDisplayingText } from './utils';
import { useOutsideClick } from '../utils';

const ELEMENTS_OFFSET = 20;

const Violations = ({ searchValue, originViolations, handleOriginTextChange }) => {
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [violations, setViolations] = React.useState([]);
  const [displayingViolations, setDisplayingViolations] = React.useState([]);
  const [visibleElementsCount, setVisibleElementsCount] = React.useState(ELEMENTS_OFFSET);
  const [editingId, setEditingId] = React.useState();
  const [contextMenuProps, setContextMenuProps] = React.useState({ x: 0, y: 0, menuItems: [], isVisible: false });
  const throttleRef = React.useRef(false);
  const customContextMenuRef = React.useRef(null);

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

  useOutsideClick(customContextMenuRef, () => setContextMenuProps({ ...contextMenuProps, isVisible: false }));

  const handleIsEditingChange = id => event => {
    setEditingId(id);
    setContextMenuProps({
      x: event.clientX,
      y: event.clientY,
      menuItems: [
        {
          label: 'id',
          onClick: () => {
            console.log('id: ', id);
          },
        },
      ],
      isVisible: true,
    });
  };

  const addViolationId = violationId => setSelectedIds([violationId, ...selectedIds]);
  const removeViolationId = violationId => setSelectedIds(selectedIds.filter(i => i !== violationId));

  const handleSelectChange = id => value => (value ? addViolationId(id) : removeViolationId(id));
  const handleTextChange = violationId => value => {
    handleOriginTextChange(violationId, value);
  };

  const onScroll = ({ top }) => {
    if (top > 0.9) {
      if (!throttleRef.current) {
        throttleRef.current = true;
        setVisibleElementsCount(visibleElementsCount + ELEMENTS_OFFSET);
        setTimeout(() => {
          throttleRef.current = false;
        }, 500);
      }
    }
  };

  const isEditing = id => editingId === id;
  const isSelected = id => selectedIds.includes(id);

  return (
    <>
      <Scrollbars hideTracksWhenNotNeeded onScrollFrame={onScroll} style={{ width: '100%', height: '100%' }}>
        {displayingViolations.length === 0 ? (
          <p className="uk-padding uk-padding-remove-horizontal">
            Нет совпадений. Позже тут появиться возможность добавить новое нарушение
          </p>
        ) : (
          <ul className="uk-list uk-list-divider uk-list-large uk-flex uk-flex-column uk-margin-remove uk-padding uk-padding-remove-horizontal">
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
      </Scrollbars>
      {contextMenuProps.isVisible && (
        <CustomContextMenu
          ref={customContextMenuRef}
          x={contextMenuProps.x}
          y={contextMenuProps.y}
          menuItems={contextMenuProps.menuItems}
        />
      )}
    </>
  );
};

export default Violations;
