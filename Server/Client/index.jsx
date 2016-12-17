import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import store from './store.jsx';
import router from './router.jsx';

render((
  <Provider store={store}>{router}</Provider>
),document.querySelector("#app"))