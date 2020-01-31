import React from 'react';
import StoreContext from 'storeon/react/context';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import store from './store';

import Board from './Board';
import Dashboard from './Dashboard';

const PublicHomePage = () => {
  return null;
};

const App = () => {
  const loggedIn = true;

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {loggedIn ? <Redirect to="/dashboard" /> : <PublicHomePage />}
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/board/:id">
          <Board />
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
