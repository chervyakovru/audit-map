/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import { getDocRef } from '../Dashboard/api';

import { getRounded } from '../utils';
import styles from './Map.module.css';

import ZoomButtons from './ZoomButtons';
import UndoButton from './UndoButton';
import Point from './Point';

const MAP_SIZE = { width: 500, height: 354 };

const handleKeyPress = () => {};

const MapComponent = ({ doc, setSelectedPointId }) => {
  const [dragging, setDragging] = React.useState(false);
  const mapRef = React.useRef(null);

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

    const { points } = doc;
    const point = {
      x: percentX,
      y: percentY,
      id: points.length,
      name: `Точка ${points.length}`,
      violationsId: []
    };

    const docRef = getDocRef(doc.id);
    docRef.update({
      points: [...points, point]
    });
  };

  const onUndo = () => {
    const { points } = doc;

    const docRef = getDocRef(doc.id);
    docRef.update({
      points: points.slice(0, -1)
    });
  };

  const defaultPosition = {
    x: (document.documentElement.clientWidth - MAP_SIZE.width) / 2,
    y: (document.documentElement.clientHeight - MAP_SIZE.height) / 2
  };
  if (!doc) return null;

  return (
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
      defaultPositionX={defaultPosition.x}
      defaultPositionY={defaultPosition.y}
      onPanning={onPanning}
      onPanningStop={onPanningStop}
    >
      {({ zoomIn, zoomOut, resetTransform, scale }) => (
        <>
          <UndoButton
            docName={doc.name}
            handleUndo={onUndo}
            pointsLength={doc.points.length}
          />
          <ZoomButtons
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            resetTransform={resetTransform}
            scale={scale}
          />
          <TransformComponent>
            <div
              ref={mapRef}
              onClick={onClick}
              onKeyPress={handleKeyPress}
              className={styles.mapContainer}
              style={{
                width: `${MAP_SIZE.width}px`,
                height: `${MAP_SIZE.height}px`,
                backgroundImage: `url(${doc.image})`
              }}
            >
              {doc.points.map(point => (
                <Point
                  key={point.id}
                  point={point}
                  setSelectedPointId={setSelectedPointId}
                />
              ))}
            </div>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};

export default MapComponent;
