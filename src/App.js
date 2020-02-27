import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './Auth';
import PrivateRoute from './Auth/PrivateRoute';

import Login from './Login';
import SignUp from './SignUp';

import Dashboard from './Dashboard';

const App = () => {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
};

export default App;
