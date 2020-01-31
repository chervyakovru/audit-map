import React from 'react';
import useStoreon from 'storeon/react';

import Header from './Header';
import Card from './Card';
import AddNewCard from './AddNewCard';

const Dashboard = () => {
  const { documents } = useStoreon('documents');

  return (
    <>
      <Header />
      <div
        className="uk-section"
        style={{ height: 'calc(100% - 80px)' }}
        uk-overflow-auto="true"
      >
        <div className="uk-container">
          <div
            className="
              uk-grid-match
              uk-child-width-1-5@m
              uk-grid-medium"
            uk-grid="true"
          >
            <div>
              <AddNewCard />
            </div>
            {documents.map(doc => {
              return (
                <div key={doc.id}>
                  <Card doc={doc} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default function() {
  return <Dashboard />;
}
