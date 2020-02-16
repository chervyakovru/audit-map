/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useParams, useLocation } from 'react-router-dom';

import { getDocRef, getPointsCollection } from '../api';
import { getRounded } from '../utils';

import ZoomButtons from './ZoomButtons';
import Point from './Point';
import Modal from './Modal';

import styles from './Map.module.css';

const handleKeyPress = () => {};

const MapComponent = ({ defaultDocument, defaultPoints, image }) => {
  const { docId } = useParams();
  const location = useLocation();
  const [dragging, setDragging] = React.useState(false);
  const [doc, setDoc] = React.useState(defaultDocument);
  const [points, setPoints] = React.useState(defaultPoints);

  const mapRef = React.useRef(null);

  React.useEffect(() => {
    return getDocRef(docId).onSnapshot(snapshot => {
      const fetchedDocument = {
        ...snapshot.data(),
        id: snapshot.id
      };
      setDoc(fetchedDocument);
    });
  }, []);

  React.useEffect(() => {
    return getPointsCollection(docId).onSnapshot(querySnapshot => {
      const fetchedPoints = querySnapshot.docs.map(point => ({
        id: point.id,
        ...point.data()
      }));
      setPoints(fetchedPoints);
    });
  }, []);

  const onPanning = () => {
    setDragging(true);
  };

  const onPanningStop = () => {
    setTimeout(() => {
      setDragging(false);
    }, 100);
  };

  const onClick = e => {
    if (dragging) return;

    const rect = mapRef.current.getBoundingClientRect();
    const posX = e.clientX - rect.left;
    const posY = e.clientY - rect.top;

    const percentX = getRounded((posX / rect.width) * 100);
    const percentY = getRounded((posY / rect.height) * 100);

    const newPoint = {
      x: percentX,
      y: percentY,
      name: `Новая точка`,
      violationsId: []
    };

    const pointsCollection = getPointsCollection(docId);
    pointsCollection.add(newPoint);
  };

  const modalPointId = location.state && location.state.modalPointId;

  return (
    <>
      <TransformWrapper
        options={{
          limitToBounds: false,
          minScale: 0.5
        }}
        doubleClick={{
          disabled: true
        }}
        wheel={{
          step: 50
        }}
        zoomIn={{
          step: 10
        }}
        defaultScale={1}
        onPanning={onPanning}
        onPanningStop={onPanningStop}
      >
        {({ zoomIn, zoomOut, resetTransform, scale }) => (
          <>
            <ZoomButtons
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              scale={scale}
              resetTransform={resetTransform}
            />
            <TransformComponent>
              <div
                ref={mapRef}
                onClick={onClick}
                onKeyPress={handleKeyPress}
                className={styles.mapContainer}
                style={{
                  width: `${image.width}px`,
                  height: `${image.height}px`,
                  backgroundImage: `url(${image.src})`
                }}
              >
                {points.map(point => (
                  <Point scale={scale} key={point.id} point={point} />
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
      {modalPointId && <Modal docId={doc.id} pointId={modalPointId} />}
    </>
  );
};

export default MapComponent;
