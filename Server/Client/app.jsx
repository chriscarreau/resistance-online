import React from 'react';
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'
import Portal from './Components/portal.jsx';
import HostMainPage from './Components/Host/hostMainPage.jsx';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Portal/>
      </div>
    )
  }
}
