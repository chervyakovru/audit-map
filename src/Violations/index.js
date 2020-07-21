import React from 'react';
import Header from '../Header';
import ViolationsList from '../ViolationsList';
import ViolationsDownloadButton from './ViolationsDownloadButton';
import { getERCollection } from '../api';
import Search from './Search';
import { ThemeContext } from '../ViolationsWithContext';

const Violations = () => {
  const [violations, setViolations] = React.useState({ data: [], isLoaded: false });
  const [searchValue, setSearchValue] = React.useState('');
  const theme = React.useContext(ThemeContext);

  const fetchViolations = async () => {
    const collection = getERCollection();
    const data = await collection.get();

    const fetchedViolations = data.docs
      .map(violation => ({
        id: violation.id,
        checked: false,
        ...violation.data(),
      }))
      .sort((a, b) => {
        if (a.checked && b.checked) return 0;
        if (a.checked) return -1;
        return 1;
      });

    setViolations({ data: fetchedViolations, isLoaded: true });
  };

  React.useEffect(() => {
    fetchViolations();
  }, []);

  const getSearch = <Search value={searchValue} onValueChange={setSearchValue} />;

  return (
    <div
      style={{ height: '100%', background: theme.theme.background }}
      tabIndex={0}
      onKeyDown={() => {}}
      role="button"
      onClick={() => {
        console.log('onClick');
        theme.toggleTheme();
      }}
    >
      <Header leftPart={getSearch} />
      <div className="uk-container" style={{ height: 'calc(100% - 80px)' }}>
        {!violations.isLoaded ? (
          <div className="uk-position-center">
            <div uk-spinner="ratio: 2" />
          </div>
        ) : (
          <>
            <ViolationsList
              originViolations={violations.data}
              handleOriginTextChange={() => console.log('handleTextChange')}
              searchValue={searchValue}
            />
            <div className="uk-margin-medium-bottom uk-position-large uk-position-bottom-right">
              <ViolationsDownloadButton />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Violations;
