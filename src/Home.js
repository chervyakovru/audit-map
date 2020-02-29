import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Dashboard from './Dashboard';
import Board from './Board';

const Home = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={Dashboard} />
      <Route path={`${path}/board/:docId`} component={Board} />
    </Switch>
  );
};

export default Home;
