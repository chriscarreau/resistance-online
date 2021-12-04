import { object } from 'prop-types';
import React from 'react';
import { IPlayerProps } from './props';

export class SpyRevealBar extends React.Component<IPlayerProps> {

  render() {
    return (
      <div className="spy-reveal-bar">
        <img src="/images/Rouge.svg" /> {this.props.player.playerName}
      </div>
    )
  }
  static propTypes = {
    player: object.isRequired
  };
}