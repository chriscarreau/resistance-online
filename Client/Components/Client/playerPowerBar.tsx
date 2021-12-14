import { bool, object } from 'prop-types';
import React from 'react';
import { ClientUpdateAction } from '../../../shared/client-update-action.interface';
import { ActionEnum } from '../../../shared/enums';
import { IPlayerPowerBarProps } from './props';

export class PlayerPowerBar extends React.Component<IPlayerPowerBarProps> {

    onPlayerSelected(){
        let ClientAction: ClientUpdateAction = {
            playerId: this.props.player.playerId,
            gameId: globalThis.gameOptions.gameId,
            action: ActionEnum.ADD_REMOVE_POWER_STEAL,
            selectedPlayerId: this.props.player.playerId,
            selectedPowerType: this.props.powerType

        }
        globalThis.socket.emit('gameUpdate', ClientAction);
    }

  render() {
    return (
      <div onClick={this.onPlayerSelected.bind(this)} className={this.props.selected ? "player-selected player-bar": "player-bar"}>
        <div>{this.props.player.playerName}: {this.props.player.powers.find(pow => pow.type === this.props.powerType).name}</div>
      </div>
    )
  }
  static propTypes = {
    player: object.isRequired,
    selected: bool.isRequired
  };
}