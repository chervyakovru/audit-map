/* eslint-disable no-unused-vars */
/* eslint-disable global-require */
import createStore from 'storeon';
import persistState from '@storeon/localstorage';
import crossTab from '@storeon/crosstab';
import modal from './Modal/reducer';
import map from './Map/reducer';
import violations from './Violations/reducer';
import documents from './Dashboard/reducer';

export default createStore([
  modal,
  map,
  violations,
  documents,
  // persistState(null, { key: 'audit-map' }),
  require('storeon/devtools/logger')
  // crossTab({ key: 'audit-map' })
]);
