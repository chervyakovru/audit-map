import React from 'react';
import { useParams } from 'react-router-dom';

import Map from '../Map';
import Modal from '../Map/Modal';
import { getDocRef } from '../Dashboard/api';

const Board = () => {
  const [doc, setDocument] = React.useState(null);
  const [selectedPointId, setSelectedPointId] = React.useState(null);
  const { id } = useParams();

  React.useEffect(() => {
    const fetchDocument = async () => {
      const docRef = await getDocRef(id).get();

      const fetchedDocument = {
        ...docRef.data(),
        id: docRef.id
      };
      setDocument(fetchedDocument);
    };
    fetchDocument();
  }, []);

  React.useEffect(() => {
    const docRef = getDocRef(id);
    docRef.onSnapshot(snapshot => {
      const fetchedDocument = {
        ...snapshot.data(),
        id: snapshot.id
      };
      setDocument(fetchedDocument);
    });
  }, []);

  if (!doc) return null;

  const selectedPoint = doc.points.find(point => point.id === selectedPointId);

  return (
    <div className="main">
      <Map doc={doc} setSelectedPointId={setSelectedPointId} />
      <Modal
        doc={doc}
        selectedPoint={selectedPoint}
        setSelectedPointId={setSelectedPointId}
      />
    </div>
  );
};

export default Board;
