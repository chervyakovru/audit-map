import createStore from 'storeon';
import logger from 'storeon/devtools/logger';
import persistState from '@storeon/localstorage';
import crossTab from '@storeon/crosstab';
import auth from './Auth/reducer';

export default createStore([auth, logger, persistState(null, { key: 'audit-map' }), crossTab({ key: 'audit-map' })]);
