import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom';

import StoreContext from 'storeon/react/context';
import useStoreon from 'storeon/react';
import store from './store';

import firebase from './firebase';
import PrivateRoute from './Auth/PrivateRoute';
import { ROUTES } from './Consts';

import Home from './Home';
import Violations from './Violations';
import Login from './Login';
import SignUp from './SignUp';
import ViolationsWithContext from './ViolationsWithContext';

const App = () => {
  const { dispatch } = useStoreon();

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      dispatch('user/set', user);
    });
  }, []);

  const MyViolations = () => (
    <ViolationsWithContext>
      <Violations />
    </ViolationsWithContext>
  );

  return (
    <Router>
      <Switch>
        <Redirect exact path={ROUTES.ROOT} to={ROUTES.HOME} />
        <PrivateRoute path={ROUTES.HOME} component={Home} />
        <PrivateRoute path={ROUTES.VIOLATIONS} component={MyViolations} />
        <Route path={ROUTES.LOGIN} component={Login} />
        <Route path={ROUTES.SIGNUP} component={SignUp} />
        <Route path="*">
          <h1>404</h1>
          <Link to={ROUTES.ROOT}>На главную</Link>
        </Route>
      </Switch>
    </Router>
  );
};

export default function() {
  return (
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
  );
}
