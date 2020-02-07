import React from 'react';

import Header from './Header';
import Card from './Card';
import AddNewCard from './AddNewCard';

import { getDocCollection } from './api';

const Dashboard = () => {
  const [documents, setDocuments] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const collection = getDocCollection();
      const query = collection.orderBy('lastUpdate', 'desc');

      const response = await query.get();
      const fetchedDocuments = response.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        };
      });
      setDocuments(fetchedDocuments);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const collection = getDocCollection();
    const query = collection.orderBy('lastUpdate', 'desc');

    return query.onSnapshot(querySnapshot => {
      const fetchedDocuments = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        };
      });
      setDocuments(fetchedDocuments);
    });
  }, []);

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
