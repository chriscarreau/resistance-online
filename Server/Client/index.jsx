import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import store from './store';
import App from './app.jsx';
import HostMainPage from './Components/Host/hostMainPage.jsx';
import ClientMainPage from './Components/Client/clientMainPage.jsx';


render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/">
        <IndexRoute component={App} />
        <Route path="host" component={HostMainPage}/>
        <Route path="client" component={ClientMainPage}/>
      </Route>
    </Router>
  </Provider>
),document.querySelector("#app"))


