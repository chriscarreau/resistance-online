import React from 'react';

export default class HostCode extends React.Component {
  render() {
    return (
      <div className="host-code">
        <span>Room #</span>
        <h2>{this.props.code}</h2>
      </div>
    )
  }
}