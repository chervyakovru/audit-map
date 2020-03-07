import React from 'react';
import { useParams } from 'react-router-dom';
import useStoreon from 'storeon/react';

import { getFileRef, getBoardsCollection, getPointsCollection } from '../api';

import Map from '../Map';
import UploadFile from './UploadFile';
import DocInfoButton from '../DocInfoButtons';

const getImageSize = (w, h) => {
  const { clientWidth, clientHeight } = document.documentElement;
  if (w < clientWidth && h < clientHeight) {
    return {
      width: w,
      height: h
    };
  }
  if (clientWidth < clientHeight) {
    const ratio = h / w;
    return {
      width: clientWidth * 0.9,
      height: clientWidth * 0.9 * ratio
    };
  }
  const ratio = w / h;
  return {
    width: clientHeight * 0.9 * ratio,
    height: clientHeight * 0.9
  };
};

const Board = () => {
  const { docId } = useParams();
  const { user } = useStoreon('user');

  const [doc, setDoc] = React.useState({ data: {}, loaded: false });
  const [points, setPoints] = React.useState({ data: [], loaded: false });
  const [image, setImage] = React.useState({
    data: {
      src: '',
      width: 0,
      height: 0
    },
    loaded: false,
    exists: false
  });

  React.useEffect(() => {
    return getBoardsCollection(user.uid)
      .doc(docId)
      .onSnapshot(snapshot => {
        const fetchedDocument = {
          ...snapshot.data(),
          id: snapshot.id
        };
        setDoc({ data: fetchedDocument, loaded: true });
      });
  }, []);

  React.useEffect(() => {
    if (!doc.loaded) return;
    if (!doc.data.mapName) {
      setImage({
        ...image,
        loaded: true,
        exists: false
      });
    } else {
      getFileRef(user.uid, docId, doc.data.mapName)
        .getDownloadURL()
        .then(url => {
          const tmpImg = new Image();
          tmpImg.addEventListener('load', () => {
            const imageSize = getImageSize(tmpImg.width, tmpImg.height);
            setImage({
              data: {
                src: url,
                ...imageSize
              },
              loaded: true,
              exists: true
            });
          });
          tmpImg.src = url;
        });
    }
  }, [doc]);

  React.useEffect(() => {
    getPointsCollection(user.uid, docId)
      .get()
      .then(querySnapshot => {
        const fetchedPoints = querySnapshot.docs.map(point => ({
          id: point.id,
          ...point.data()
        }));
        setPoints({ data: fetchedPoints, loaded: true });
      });
  }, []);

  if (!doc.loaded || !image.loaded || !points.loaded) {
    return (
      <div className="main">
        <div className="uk-position-center uk-text-center">
          <div uk-spinner="ratio: 2" />
        </div>
      </div>
    );
  }

  console.log(doc);
  console.log(doc.data.name);

  return (
    <>
      {!image.exists ? (
        <>
          <DocInfoButton docId={doc.data.id} docTitle={doc.data.name} />
          <UploadFile />
        </>
      ) : (
        <Map
          defaultDocument={doc.data}
          defaultPoints={points.data}
          image={image.data}
        />
      )}
    </>
  );
};

export default Board;
