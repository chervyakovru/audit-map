/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import useStoreon from 'storeon/react';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { user } = useStoreon('user');

  return (
    <Route
      {...rest}
      render={routeProps =>
        user ? <RouteComponent {...routeProps} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
