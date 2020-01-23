import React from 'react';
import StoreContext from 'storeon/react/context';
import store from './store';

import Map from './Map';
import Modal from './Modal';

const App = () => {
  return (
    <div className="main">
      <Map />
      <Modal />
    </div>
  );
};

export default function() {
  return (
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
  );
}
