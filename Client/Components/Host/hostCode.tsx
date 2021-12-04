import React from 'react';

export class HostCode extends React.Component<{code: string}> {
  render() {
    return (
      <div className="host-code">
        <span>Partie #</span>
        <h2>{this.props.code}</h2>
      </div>
    )
  }
}
