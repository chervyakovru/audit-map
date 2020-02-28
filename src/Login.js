import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import useStoreon from 'storeon/react';

import firebase from './firebase';

const Login = ({ history }) => {
  const handleLogin = React.useCallback(
    async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push('/');
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const { userId } = useStoreon('userId');

  if (userId) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            name="email"
            placeholder="name@domain.com"
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
          />
        </label>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default withRouter(Login);
