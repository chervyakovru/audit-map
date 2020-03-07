import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from 'react-router-dom';

import StoreContext from 'storeon/react/context';
import useStoreon from 'storeon/react';
import store from './store';

import firebase from './firebase';
import PrivateRoute from './Auth/PrivateRoute';

import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';

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
        <Redirect exact path="/" to="/app" />
        <PrivateRoute path="/app" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="*">
          <h1>404</h1>
          <Link to="/">На главную</Link>
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
