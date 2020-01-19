/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import map from './map.jpg';

const handleKeyPress = () => {};

const App = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    >
      <TransformWrapper
        options={{
          limitToBounds: false
        }}
        defaultScale={1}
        defaultPositionX={200}
        defaultPositionY={100}
        style={{ width: '100%', height: '100%' }}
      >
        <TransformComponent>
          <div
            onClick={e => alert(`${e.clientX}, ${e.clientY}`)}
            onKeyPress={handleKeyPress}
            role="main"
            style={{
              width: '475px',
              height: '300px'
            }}
          >
            <img
              src={map}
              alt="map"
              style={{
                border: '1px solid gray'
              }}
            />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default App;
