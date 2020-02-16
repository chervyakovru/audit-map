import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { MdHome } from 'react-icons/md';
import { getDocRef, getDocFileUrl, getPointsCollection } from '../api';

import Map from '../Map';
import UploadFile from './UploadFile';
import Button from '../Button';
import BoardPanel from '../BoardPanel';

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

const MapComponent = () => {
  const history = useHistory();
  const { docId } = useParams();
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
    return getDocRef(docId).onSnapshot(snapshot => {
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
      getDocFileUrl(docId, doc.data.mapName).then(url => {
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
    getPointsCollection(docId)
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

  return (
    <>
      <BoardPanel title={doc.name}>
        <Button onClick={() => history.push('/dashboard')} tooltip="На главную">
          <MdHome size="25px" />
        </Button>
      </BoardPanel>
      {!image.exists ? (
        <UploadFile />
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

export default MapComponent;
