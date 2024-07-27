import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { ROUTES } from './Consts';

import Dashboard from './Dashboard';
import Board from './Board';
import EmptyBoardRedirect from './EmptyBoardRedirect';

const Home = () => {
  return (
    <Switch>
      <Route exact path={ROUTES.HOME} component={Dashboard} />
      <Route path={ROUTES.BOARD_MATCH} component={Board} />
      <Route path={ROUTES.BOARD_EMPTY_LAYER} component={EmptyBoardRedirect} />
    </Switch>
  );
};

export default Home;
