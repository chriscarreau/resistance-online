import { bool, object } from 'prop-types';
import React from 'react';
import { ClientUpdateAction } from '../../../shared/client-update-action.interface';
import { ActionEnum } from '../../../shared/enums';
import { IPlayerBarProps } from './props';

export class PlayerBar extends React.Component<IPlayerBarProps> {

    onPlayerSelected(){
        let ClientAction: ClientUpdateAction = {
            playerId: this.props.player.playerId,
            gameId: globalThis.gameOptions.gameId,
            action: ActionEnum.ADD_REMOVE_PLAYER_TEAM
        }
        globalThis.socket.emit('gameUpdate', ClientAction);
    }

  render() {
    return (
      <div onClick={this.onPlayerSelected.bind(this)} className={this.props.selected ? "player-selected player-bar": "player-bar"}>
        <div>{this.props.player.playerName}</div>
      </div>
    )
  }
  static propTypes = {
    player: object.isRequired,
    selected: bool.isRequired
  };
}