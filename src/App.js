import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import StoreContext from 'storeon/react/context';
import useStoreon from 'storeon/react';
import store from './store';

import firebase from './firebase';
import PrivateRoute from './Auth/PrivateRoute';

import Login from './Login';
import SignUp from './SignUp';

import Dashboard from './Dashboard';

const App = () => {
  const { dispatch } = useStoreon();

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      dispatch('user/set', user);
    });
  }, []);

  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/" component={Dashboard} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="*">
          <h1>404</h1>
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
