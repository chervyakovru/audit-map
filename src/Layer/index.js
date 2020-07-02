import React from 'react';
import { useParams } from 'react-router-dom';
import useStoreon from 'storeon/react';

import { getFileRef, getLayersCollection, getPointsCollection } from '../api';

import UploadFile from '../Board/UploadFile';
import Map from '../Map';

const getFitScreenImageSize = (w, h) => {
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

const getImageSizeFromUrl = async url => {
  return new Promise(resolve => {
    const tmpImg = new Image();
    tmpImg.addEventListener('load', () => {
      const imageSize = getFitScreenImageSize(tmpImg.width, tmpImg.height);
      resolve(imageSize);
    });
    tmpImg.src = url;
  });
};

const Layer = () => {
  const { boardId, layerId } = useParams();
  const { user } = useStoreon('user');

  const [isRotating, setIsRotating] = React.useState(false);
  const [image, setImage] = React.useState({
    data: {
      src: '',
      name: '',
      width: 0,
      height: 0,
    },
    loaded: false,
    exists: false,
  });

  React.useEffect(() => {
    const func = async () => {
      setImage({
        loaded: false,
        exists: false,
      });

      const layerSnapshot = await getLayersCollection(user.uid, boardId)
        .doc(layerId)
        .get();

      const { mapName } = layerSnapshot.data();
      if (!mapName) {
        setImage({
          loaded: true,
          exists: false,
        });
        return;
      }

      const url = await getFileRef(user.uid, boardId, layerId, mapName).getDownloadURL();
      const imageSize = await getImageSizeFromUrl(url);

      setImage({
        data: {
          src: url,
          name: mapName,
          ...imageSize,
        },
        loaded: true,
        exists: true,
      });
    };
    func();
  }, [layerId]);

  function getRotatedImageData(url) {
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
          resolve({ blob, width: canvas.width, height: canvas.height });
        });
      });
      tmpImg.src = url;
    });
  }

  const rotatePoints = async () => {
    const querySnapshot = await getPointsCollection(user.uid, boardId, layerId).get();
    querySnapshot.docs.forEach(point => {
      const newX = -point.data().y < 0 ? -point.data().y + 100 : -point.data().y;
      const newY = point.data().x < 0 ? point.data().x + 100 : point.data().x;
      point.ref.update({
        x: newX,
        y: newY,
      });
    });
  };

  const uploadImage = blob => {
    return new Promise(resolve => {
      const mapRef = getFileRef(user.uid, boardId, layerId, image.data.name);
      mapRef.put(blob).then(() => {
        resolve();
      });
    });
  };

  const rotateImage = async () => {
    const rotatedImageData = await getRotatedImageData(image.data.src);
    await uploadImage(rotatedImageData.blob);

    URL.revokeObjectURL(image.data.src);
    const newImageUrl = URL.createObjectURL(rotatedImageData.blob);
    const fitScreenImageSize = getFitScreenImageSize(rotatedImageData.width, rotatedImageData.height);
    setImage({
      ...image,
      data: {
        src: newImageUrl,
        ...fitScreenImageSize,
      },
    });
  };

  const handleRotate = async () => {
    if (!isRotating) {
      setIsRotating(true);
      await rotateImage();
      await rotatePoints();
      setIsRotating(false);
    }
  };

  if (!image.loaded) {
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

  return <Map image={image.data} handleRotate={handleRotate} />;
};

export default Layer;
