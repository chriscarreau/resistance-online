import React from 'react';
import { PlayerBar } from './playerBar';
import { IsCurrentTeamComplete, GetCurrentPlayer, IsPlayerSelectedForPower } from '../../Utils';
import { IPowerSelectionProps } from './props';
import { object } from 'prop-types';
import { ClientUpdateAction } from '../../../shared/client-update-action.interface';
import { ActionEnum, GameStateEnum } from '../../../shared/enums';
import { PowerCard } from './powerCard';

export class PagePowerSelection extends React.Component<IPowerSelectionProps> {

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
    let content, text, selectingPlayerContent, otherPlayersContent;

    const currentPlayer = GetCurrentPlayer(this.props.game);
    if (this.props.selectingPlayer.playerId === currentPlayer.playerId) {
      text = this.props.game.gameState === GameStateEnum.GIVE_POWER ? "Sélectionnez à qui donner le pouvoir" : "Sélectionnez sur qui utiliser le pouvoir"
      selectingPlayerContent = (<div className="player-selection-content">
        <div className="player-selection-header">
           {text}
          <PowerCard powerType={this.props.powerType}></PowerCard>
        </div>
        {
          this.props.players.map(function (x, i) {
            return (<PlayerBar key={i} selected={IsPlayerSelectedForPower(x, that.props.game)} player={x}></PlayerBar>);
          })
        }
        <div>
          <button disabled={this.props.game.powerSelectionPlayers.length !== 1} onClick={this.submitTeam} className="btn btn-primary">Soumettre</button>
        </div>
      </div>);
    } else {
      text = this.props.game.gameState === GameStateEnum.GIVE_POWER ? "En attente que le leader distribue le pouvoir" : "En attente du joueur qui utilise le pouvoir"
      otherPlayersContent = (<div>
        {text}
       <PowerCard powerType={this.props.powerType}></PowerCard>
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