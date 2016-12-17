import React from 'react';

class HostCode extends React.Component {
  render() {
    return (
      <div className="host-code">
        <span>Room #</span>
        <h2>{this.props.code}</h2>
      </div>
    )
  }
}

export default HostCode;