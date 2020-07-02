import React from 'react';
import { useParams } from 'react-router-dom';
import useStoreon from 'storeon/react';

import { MdRotateRight } from 'react-icons/md';
import { getFileRef, getLayersCollection, getPointsCollection } from '../api';

import UploadFile from '../Board/UploadFile';
import Map from '../Map';
import Button from '../Button';

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

  function rotate(url) {
    return new Promise(resolve => {
      const tmpImg = new Image();
      tmpImg.crossOrigin = 'anonymous';
      tmpImg.addEventListener('load', () => {
        const canvas = document.createElement('canvas');
        canvas.width = tmpImg.height;
        canvas.height = tmpImg.width;

        const ctx = canvas.getContext('2d');
        ctx.transform(0, 1, -1, 0, tmpImg.height, 0);
        ctx.drawImage(tmpImg, 0, 0, tmpImg.width, tmpImg.height);

        canvas.toBlob(blob => {
          const newImageUrl = URL.createObjectURL(blob);

          resolve({ src: newImageUrl, width: canvas.width, height: canvas.height });
        });
      });
      tmpImg.src = url;
    });
  }

  const handleChange = async () => {
    const data = await rotate(image.data.src);
    const imageSize = getImageSize(data.width, data.height);

    setImage({
      data: {
        src: data.src,
        ...imageSize,
      },
      loaded: true,
      exists: true,
    });

    getPointsCollection(user.uid, boardId, layerId)
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.forEach(point => {
          const newX = -point.data().y < 0 ? -point.data().y + 100 : -point.data().y;
          const newY = point.data().x < 0 ? point.data().x + 100 : point.data().x;
          point.ref.update({
            x: newX,
            y: newY,
          });
        });
      });
  };

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
  return (
    <>
      <Button onClick={handleChange} tooltip="Повернуть по часовой стрелке">
        <MdRotateRight size="25px" />
      </Button>
      <Map defaultLayer={layer.data} image={image.data} />
    </>
  );
};

export default Layer;
