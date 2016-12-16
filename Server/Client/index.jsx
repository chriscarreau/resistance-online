import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import { AppContainer } from 'react-hot-loader';
import App from './app.jsx';
import HostMainPage from './Components/Host/hostMainPage.jsx';
import ClientMainPage from './Components/Client/clientMainPage.jsx';


render((
  <Router history={browserHistory}>
    <Route path="/">
      <IndexRoute component={App} />
      <Route path="host" component={HostMainPage}/>
      <Route path="client" component={ClientMainPage}/>
    </Route>
  </Router>
),document.querySelector("#app"))


