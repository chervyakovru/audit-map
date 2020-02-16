/* eslint-disable no-unused-vars */
/* eslint-disable global-require */
import createStore from 'storeon';
import persistState from '@storeon/localstorage';
import crossTab from '@storeon/crosstab';
import violations from './Violations/reducer';

export default createStore([
  violations,
  // persistState(null, { key: 'audit-map' }),
  require('storeon/devtools/logger'),
  crossTab({ key: 'audit-map' })
]);
