import React from 'react';
import { useParams } from 'react-router-dom';
import useStoreon from 'storeon/react';

import { getFileRef, getLayersCollection, getPointsCollection } from '../api';

import UploadFile from '../Board/UploadFile';
import Map from '../Map';

const getImageSize = (w, h) => {
  const { clientWidth, clientHeight } = document.documentElement;
  if (w < clientWidth && h < clientHeight) {
    return {
      width: w,
      height: h,
    };
  }
  if (clientWidth < clientHeight) {
    const ratio = h / w;
    return {
      width: clientWidth * 0.9,
      height: clientWidth * 0.9 * ratio,
    };
  }
  const ratio = w / h;
  return {
    width: clientHeight * 0.9 * ratio,
    height: clientHeight * 0.9,
  };
};

const Layer = () => {
  const { boardId, layerId } = useParams();
  const { user } = useStoreon('user');

  const [layer, setLayer] = React.useState({ data: {}, loaded: false });
  const [points, setPoints] = React.useState({ data: [], loaded: false });
  const [image, setImage] = React.useState({
    data: {
      src: '',
      width: 0,
      height: 0,
    },
    loaded: false,
    exists: false,
  });

  React.useEffect(() => {
    return getLayersCollection(user.uid, boardId)
      .doc(layerId)
      .onSnapshot(layerSnapshot => {
        const fetchedLayer = {
          ...layerSnapshot.data(),
          id: layerSnapshot.id,
        };

        setLayer({ data: fetchedLayer, loaded: true });
      });
  }, [layerId]);

  React.useEffect(() => {
    if (!layer.loaded) return;
    if (!layer.data.mapName) {
      setImage({
        ...image,
        loaded: true,
        exists: false,
      });
      return;
    }
    getFileRef(user.uid, boardId, layerId, layer.data.mapName)
      .getDownloadURL()
      .then(url => {
        const tmpImg = new Image();
        tmpImg.addEventListener('load', () => {
          const imageSize = getImageSize(tmpImg.width, tmpImg.height);
          setImage({
            data: {
              src: url,
              ...imageSize,
            },
            loaded: true,
            exists: true,
          });
        });
        tmpImg.src = url;
      });
  }, [layer]);

  React.useEffect(() => {
    if (!layer.data.mapName) {
      setPoints({ data: [], loaded: true });
      return;
    }
    getPointsCollection(user.uid, boardId, layerId)
      .get()
      .then(querySnapshot => {
        const fetchedPoints = querySnapshot.docs.map(point => ({
          id: point.id,
          ...point.data(),
        }));
        setPoints({ data: fetchedPoints, loaded: true });
      });
  }, [layerId]);

  if (!layer.loaded || !image.loaded || !points.loaded) {
    return (
      <div className="main">
        <div className="uk-position-center uk-text-center">
          <div uk-spinner="ratio: 2" />
        </div>
      </div>
    );
  }

  if (!image.exists) {
    return <UploadFile />;
  }
  return <Map defaultLayer={layer.data} image={image.data} />;
};

export default Layer;
