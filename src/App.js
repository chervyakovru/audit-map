import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import styled from 'styled-components';

import map from './map.jpg';

const DOT_SIZE = 10;
const MAP_SIZE = { width: 500, height: 354 };

const handleKeyPress = () => {};

const getRounded = number => Math.round(number * 100) / 100;

const MapContainer = styled.div`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-image: url(${props => props.src});
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: cover;
  border: 1px solid gray;
`;

const Dot = styled.div`
  width: ${DOT_SIZE}px;
  height: ${DOT_SIZE}px;
  border-radius: 50%;
  background-color: red;
  position: absolute;
  left: ${props => props.left}%;
  top: ${props => props.top}%;
`;

const getDots = dots => {
  return dots.map(dot => {
    return (
      <Dot
        key={dot.id}
        left={dot.x}
        top={dot.y}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          alert(`Вы нажали точку номер ${dot.id}`);
        }}
      />
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

  const onClick = (e, scale) => {
    if (dragging) return;
    const rect = mapRef.current.getBoundingClientRect();
    const posX = e.clientX - rect.left - (DOT_SIZE / 2) * scale;
    const posY = e.clientY - rect.top - (DOT_SIZE / 2) * scale;

    const percentX = getRounded((posX / rect.width) * 100);
    const percentY = getRounded((posY / rect.height) * 100);

    setLocations([
      ...locations,
      { x: percentX, y: percentY, id: locations.length }
    ]);

    console.log('add new dot');
  };

  const defaultPosition = {
    x: (document.documentElement.clientWidth - MAP_SIZE.width) / 2,
    y: (document.documentElement.clientHeight - MAP_SIZE.height) / 2
  };

  return (
    <TransformWrapper
      options={{
        limitToBounds: false
      }}
      doubleClick={{
        disabled: true
      }}
      wheel={{
        step: 50
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
          <div className="tools">
            <button type="button" onClick={zoomIn}>
              +
            </button>
            <button type="button" onClick={zoomOut}>
              -
            </button>
            <button type="button" onClick={resetTransform}>
              RESET
            </button>
          </div>
          <TransformComponent>
            <MapContainer
              ref={mapRef}
              onClick={e => onClick(e, scale)}
              onKeyPress={handleKeyPress}
              role="main"
              width={MAP_SIZE.width}
              height={MAP_SIZE.height}
              src={map}
            >
              {getDots(locations)}
            </MapContainer>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};

export default App;
