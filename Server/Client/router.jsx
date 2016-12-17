import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './app.jsx';
import HostMainPage from './Components/Host/hostMainPage.jsx';
import ClientMainPage from './Components/Client/clientMainPage.jsx';

export default (
    <Router history={browserHistory}>
      <Route path="/">
        <IndexRoute component={App} />
        <Route path="host" component={HostMainPage}/>
        <Route path="client" component={ClientMainPage}/>
      </Route>
    </Router>
);