import React from 'react';
import { useParams } from 'react-router-dom';
import useStoreon from 'storeon/react';

import { getFileRef, getLayersCollection, getPointsCollection } from '../api';

import UploadFile from '../Board/UploadFile';
import Map from '../Map';

import { getImageSizeFromUrl, getFitScreenImageSize, getRotatedImageData, getRotatedCoordinate } from './utils';

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
    const loadImage = async () => {
      setImage({
        loaded: false,
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
      const size = await getImageSizeFromUrl(url);
      const fitScreenSize = getFitScreenImageSize(document.documentElement, size);

      setImage({
        data: {
          src: url,
          name: mapName,
          ...fitScreenSize,
        },
        loaded: true,
        exists: true,
      });
    };
    loadImage();
  }, [layerId]);

  const uploadImage = async blob => {
    const imageRef = getFileRef(user.uid, boardId, layerId, image.data.name);
    await imageRef.put(blob);
  };

  const rotateAndUploadPoints = async () => {
    const pointsSnapshot = await getPointsCollection(user.uid, boardId, layerId).get();
    await Promise.all(
      pointsSnapshot.docs.map(point => {
        const { x, y } = point.data();
        const [newX, newY] = getRotatedCoordinate(x, y);
        return point.ref.update({
          x: newX,
          y: newY,
        });
      })
    );
  };

  const handleRotate = async () => {
    if (!isRotating) {
      setIsRotating(true);
      const rotatedImageData = await getRotatedImageData(image.data.src);

      await uploadImage(rotatedImageData.blob);
      await rotateAndUploadPoints();

      const rotatedImageUrl = URL.createObjectURL(rotatedImageData.blob);

      const fitScreenImageSize = getFitScreenImageSize(document.documentElement, rotatedImageData);

      setImage({
        ...image,
        data: {
          src: rotatedImageUrl,
          ...fitScreenImageSize,
        },
      });

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
