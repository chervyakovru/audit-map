import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import 'uikit/dist/css/uikit.css';
import './index.css';
import App from './App';

UIkit.use(Icons);

ReactDOM.render(<App />, document.getElementById('root'));
