/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { getRounded } from '../utils';
import styles from './Map.module.css';

import map from './map.jpg';
import ZoomButtons from './ZoomButtons';
import UndoButton from './UndoButton';

const DOT_SIZE = 10;
const MAP_SIZE = { width: 500, height: 354 };

const handleKeyPress = () => {};

const getDots = dots => {
  return dots.map(dot => {
    return (
      <div
        key={dot.id}
        className={`${styles.dot} uk-position-absolute uk-transform-center`}
        style={{
          width: `${DOT_SIZE}px`,
          height: `${DOT_SIZE}px`,
          left: `${dot.x}%`,
          top: `${dot.y}%`
        }}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          alert(`Вы нажали точку номер ${dot.id}`);
        }}
        onKeyPress={handleKeyPress}
      >
        <span>{dot.id}</span>
      </div>
    );
  });
};

const App = () => {
  const [dragging, setDragging] = React.useState(false);
  const mapRef = React.useRef(null);
  const [locations, setLocations] = React.useState([]);

  const onPanningStart = () => {
    console.log('onPanningStart');
  };

  const onPanning = () => {
    console.log('onPanning');
    setDragging(true);
  };

  const onPanningStop = () => {
    console.log('onPanningStop');
    setTimeout(() => {
      setDragging(false);
    }, 100);
  };

  const onZoomChange = e => {
    console.log('onZoomChange: ', e);
  };

  const onClick = e => {
    if (dragging) return;
    const rect = mapRef.current.getBoundingClientRect();
    const posX = e.clientX - rect.left;
    const posY = e.clientY - rect.top;

    const percentX = getRounded((posX / rect.width) * 100);
    const percentY = getRounded((posY / rect.height) * 100);

    setLocations([
      ...locations,
      { x: percentX, y: percentY, id: locations.length }
    ]);

    console.log('add new dot');
  };

  const handleUndo = () => {
    setLocations(locations.slice(0, -1));
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
      style={{ width: '100%', height: '100%' }}
      onPanningStart={onPanningStart}
      onPanning={onPanning}
      onPanningStop={onPanningStop}
      onZoomChange={onZoomChange}
    >
      {({ zoomIn, zoomOut, resetTransform, scale }) => (
        <>
          <UndoButton
            handleUndo={handleUndo}
            locationsLength={locations.length}
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
                backgroundImage: `url(${map})`
              }}
            >
              {getDots(locations)}
            </div>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};

export default App;
