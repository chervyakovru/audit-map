import React from 'react';
import { useHistory } from 'react-router-dom';
import useStoreon from 'storeon/react';
import { fbTimestamp, getBoardsCollection } from '../api';
import { ROUTES } from '../Consts';

import Header from './Header';
import Card from './Card';
import AddNewCard from './AddNewCard';

const Dashboard = () => {
  const history = useHistory();
  const [documents, setDocuments] = React.useState({ data: [], loaded: false });
  const { user } = useStoreon('user');
  const getBoardsData = async boardsSnapshot => {
    const fetchedDocumentsPromises = boardsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    const fetchedDocuments = await Promise.all(fetchedDocumentsPromises);
    setDocuments({ data: fetchedDocuments, loaded: true });
  };

  React.useEffect(() => {
    const query = getBoardsCollection(user.uid).orderBy('lastUpdate', 'desc');

    return query.onSnapshot(querySnapshot => {
      getBoardsData(querySnapshot);
    });
  }, []);

  const createNewBoard = () => {
    getBoardsCollection(user.uid)
      .add({
        name: 'Новый документ',
        lastUpdate: fbTimestamp,
      })
      .then(async docRef => {
        const layerRef = await docRef.collection('layers').add({ name: 'Новый слой', lastUpdate: fbTimestamp });
        history.push(ROUTES.BOARD(docRef.id, layerRef.id));
      });
  };

  return (
    <>
      <Header />
      <div className="uk-section" style={{ height: 'calc(100% - 80px)' }} uk-overflow-auto="true">
        <div className="uk-container">
          <div
            className="
              uk-grid-match
              uk-child-width-1-5@m
              uk-grid-medium"
            uk-grid="true"
          >
            <div>
              <AddNewCard createNewBoard={createNewBoard} />
            </div>
            {documents.loaded ? (
              documents.data.map(doc => {
                return (
                  <div key={doc.id}>
                    <Card doc={doc} />
                  </div>
                );
              })
            ) : (
              <div className="uk-card uk-height-medium">
                <div className="uk-position-center uk-text-center">
                  <div uk-spinner="ratio: 2" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
