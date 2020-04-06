import React from 'react';

class SpyRevealBar extends React.Component {

  render() {
    return (
      <div className="spy-reveal-bar">
        <img src="/images/Rouge.svg" /> {this.props.spy.playerName}
      </div>
    )
  }
}

SpyRevealBar.propTypes = {
  spy: React.PropTypes.object.isRequired
};

export default SpyRevealBar;