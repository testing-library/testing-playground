import 'regenerator-runtime/runtime';
import 'react-toastify/dist/ReactToastify.min.css';
import './service-worker';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

ReactDOM.render(<App />, document.getElementById('app'));
