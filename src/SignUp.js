import React from 'react';
import { withRouter } from 'react-router-dom';
import firebase from './firebase';

const SignUp = ({ history }) => {
  const handleSignUp = React.useCallback(
    async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value);
        history.push('/');
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  return (
    <div>
      <h1>Sign up</h1>
      <form onSubmit={handleSignUp}>
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
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
};

export default withRouter(SignUp);
