import React from 'react';
import { withRouter, Redirect, Link } from 'react-router-dom';
import useStoreon from 'storeon/react';

import firebase from './firebase';

const Login = ({ history }) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = React.useCallback(
    async event => {
      event.preventDefault();
      setLoading(true);

      const { email, password } = event.target.elements;
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push('/');
      } catch (error) {
        alert(error);
        setLoading(false);
      }
    },
    [history]
  );

  const { user } = useStoreon('user');

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div
      className="uk-section uk-section-muted uk-flex uk-flex-middle uk-animation-fade"
      uk-height-viewport="true"
    >
      <div className="uk-width-1-1">
        <div className="uk-container">
          <div className="uk-grid-margin uk-grid uk-grid-stack" uk-grid="true">
            <div className="uk-width-1-1@m">
              <div className="uk-margin uk-width-large uk-margin-auto uk-card uk-card-default uk-card-body uk-box-shadow-large">
                {loading ? (
                  <div className="uk-position-center uk-text-center">
                    <div uk-spinner="ratio: 2" />
                  </div>
                ) : (
                  <>
                    <h3 className="uk-card-title uk-text-center">
                      С возвращением!
                    </h3>
                    <form onSubmit={handleLogin}>
                      <div className="uk-margin">
                        <div className="uk-inline uk-width-1-1">
                          <span className="uk-form-icon" uk-icon="icon: mail" />
                          <input
                            className="uk-input uk-form-large"
                            type="email"
                            name="email"
                            placeholder="name@domain.com"
                          />
                        </div>
                      </div>
                      <div className="uk-margin">
                        <div className="uk-inline uk-width-1-1">
                          <span className="uk-form-icon" uk-icon="icon: lock" />
                          <input
                            className="uk-input uk-form-large"
                            name="password"
                            type="password"
                            placeholder="******"
                          />
                        </div>
                      </div>
                      <div className="uk-margin">
                        <button
                          type="submit"
                          className="uk-button uk-button-primary uk-button-large uk-width-1-1"
                        >
                          Войти
                        </button>
                      </div>
                      <div className="uk-text-small uk-text-center">
                        Еще не зарегистрированы?{' '}
                        <Link to="/signup">Создать аккаунт</Link>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);
