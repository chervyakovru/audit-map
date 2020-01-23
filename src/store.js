import createStore from 'storeon';
import persistState from '@storeon/localstorage';
import crossTab from '@storeon/crosstab';
import modal from './Modal/reducer';
import map from './Map/reducer';
import violations from './Violations/reducer';

export default createStore([
  modal,
  map,
  violations,
  persistState(null, { key: 'audit-map' }),
  /* eslint-disable global-require */
  require('storeon/devtools/logger'),
  crossTab({ key: 'audit-map' })
]);
