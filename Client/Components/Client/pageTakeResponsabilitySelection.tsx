import React from 'react';
import { PlayerBar } from './playerBar';
import { GetCurrentPlayer, GetPlayerWithPower, IsPowerSelectedForSteal } from '../../Utils';
import { IGameProps } from './props';
import { object } from 'prop-types';
import { ClientUpdateAction } from '../../../shared/client-update-action.interface';
import { ActionEnum } from '../../../shared/enums';
import { PlayerPowerBar } from './playerPowerBar';
import { PowerTypeEnum } from '../../../shared/power.interface';
import { IPlayer } from '../../../shared/player.interface';

export class PageTakeResponsabilitySelection extends React.Component<IGameProps> {

  submitTeam() {
    let ClientAction: ClientUpdateAction = {
      playerId: globalThis.gameOptions.playerId,
      gameId: globalThis.gameOptions.gameId,
      action: ActionEnum.SUBMIT_TEAM
    }
    globalThis.socket.emit('gameUpdate', ClientAction);
  }

  render() {
    var that = this;
    let content, selectingPlayerContent, otherPlayersContent;

    const currentPlayer = GetCurrentPlayer(this.props.game);
    const selectingPlayer = GetPlayerWithPower(this.props.game, PowerTypeEnum.TakeResponsability);
    const playerPowerList: {player: IPlayer, powerType: PowerTypeEnum}[] = [];
    for(let player of this.props.game.players) {
      if (player.playerId === selectingPlayer.playerId) {
        continue;
      }
      for(const power of player.powers) {
        playerPowerList.push({player: player, powerType: power.type});
      }
    }
    if (selectingPlayer.playerId === currentPlayer.playerId) {
      selectingPlayerContent = (<div  className="player-selection-content">
        <div className="player-selection-header">
          Sélectionnez un pouvoir
        </div>
        {
          playerPowerList.map(function (x, i) {
            return (<PlayerPowerBar key={i} selected={IsPowerSelectedForSteal(x.player, x.powerType, that.props.game)} player={x.player} powerType={x.powerType}></PlayerPowerBar>);
          })
        }
        <div>
          <button disabled={this.props.game.powerStealingSelection.length !== 1} onClick={this.submitTeam} className="btn btn-primary">Soumettre</button>
        </div>
      </div>);
    } else {
      otherPlayersContent = (<div>
        En attente de la sélection du joueur
      </div>);
    }
    content = (<div>
      {selectingPlayerContent}
      {otherPlayersContent}
    </div>);

    return (
      <div>
        {content}
      </div>
    )
  }
  static propTypes = {
    player: object.isRequired,
    game: object.isRequired
  };
}