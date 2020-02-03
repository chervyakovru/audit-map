import map from '../Map/map.jpg';

export default function(store) {
  store.on('@init', () => ({
    documents: [
      {
        id: '0',
        name: 'Садик #2',
        lastUpdate: '2020-01-24T21:50:00+00:00',
        thumbnailSrc: map,
        points: []
      }
    ]
  }));
  store.on('documents/set', (prevState, documents) => ({
    documents
  }));
  store.on('documents/add', ({ documents }, doc) => ({
    documents: [...documents, doc]
  }));
  store.on('document/duplicate', ({ documents }, docId) => {
    const doc = documents.find(el => el.id === docId);
    const ids = documents.map(el => parseInt(el.id, 10));
    const newId = Math.max(...ids) + 1;
    const newDocuments = [
      ...documents,
      {
        ...doc,
        id: newId.toString(),
        name: `${doc.name} (копия) (${newId})`
      }
    ];
    return {
      documents: newDocuments
    };
  });
  store.on('document/delete', ({ documents }, docId) => {
    const newDocuments = documents.reduce((acc, doc) => {
      if (doc.id !== docId) return [...acc, doc];
      return acc;
    }, []);

    return {
      documents: newDocuments
    };
  });
  store.on('document/points/add', ({ documents }, { docId, point }) => {
    const newDocuments = documents.map(doc => {
      if (doc.id !== docId) return doc;
      return {
        ...doc,
        points: [...doc.points, point]
      };
    });

    return {
      documents: newDocuments
    };
  });
  store.on('document/points/pop', ({ documents }, docId) => {
    const newDocuments = documents.map(doc => {
      if (doc.id !== docId) return doc;
      return {
        ...doc,
        points: doc.points.slice(0, -1)
      };
    });

    return {
      documents: newDocuments
    };
  });
  store.on('document/points/update', ({ documents }, { docId, point }) => {
    const newDocuments = documents.map(doc => {
      if (doc.id !== docId) return doc;
      const newPoints = doc.points.map(el => {
        if (el.id !== point.id) return el;
        return point;
      });
      return {
        ...doc,
        points: newPoints
      };
    });
    return {
      documents: newDocuments
    };
  });
}
