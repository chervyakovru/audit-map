/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import useStoreon from 'storeon/react';

import { getRounded } from '../utils';
import styles from './Map.module.css';

import ZoomButtons from './ZoomButtons';
import UndoButton from './UndoButton';
import Point from './Point';
import map from './map.jpg';

const MAP_SIZE = { width: 500, height: 354 };

const handleKeyPress = () => {};

const App = () => {
  const [dragging, setDragging] = React.useState(false);
  const mapRef = React.useRef(null);
  const { dispatch, points } = useStoreon('points');

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

    dispatch('points/add', {
      x: percentX,
      y: percentY,
      id: points.length,
      name: `Точка ${points.length}`,
      violationsId: []
    });
  };

  const handleUndo = () => {
    dispatch('points/pop');
  };

  const defaultPosition = {
    x: (document.documentElement.clientWidth - MAP_SIZE.width) / 2,
    y: (document.documentElement.clientHeight - MAP_SIZE.height) / 2
  };

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
          <UndoButton handleUndo={handleUndo} pointsLength={points.length} />
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
                backgroundImage: `url(${map})`
              }}
            >
              {points.map(point => (
                <Point key={point.id} point={point} />
              ))}
            </div>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};

export default App;
