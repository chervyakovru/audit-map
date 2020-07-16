import React from 'react';
import Header from '../Header';
import ViolationsList from '../ViolationsList';
import ViolationsDownloadButton from './ViolationsDownloadButton';
import { getERCollection } from '../api';

const Violations = () => {
  const [violations, setViolations] = React.useState({ data: [], isLoaded: false });

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

  return (
    <>
      <Header />
      <div style={{ paddingTop: '50px', height: 'calc(100% - 80px)', boxSizing: 'border-box' }}>
        {!violations.isLoaded ? (
          <div className="uk-position-center">
            <div uk-spinner="ratio: 2" />
          </div>
        ) : (
          <>
            <div
              style={{ boxSizing: 'content-box' }}
              className={`
                uk-container
                uk-height-1-1
                uk-flex
                uk-flex-column
                uk-overflow-hidden`}
            >
              <ViolationsList
                originViolations={violations.data}
                handleOriginTextChange={() => console.log('handleTextChange')}
              />
            </div>
            <div className="uk-margin-medium-bottom uk-position-large uk-position-bottom-right">
              <ViolationsDownloadButton />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Violations;
