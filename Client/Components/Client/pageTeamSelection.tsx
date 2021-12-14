import React from 'react';
import { PlayerBar } from './playerBar';
import { IsPlayerInCurrentTeam, IsCurrentTeamComplete } from '../../Utils';
import { ITeamSelectionProps } from './props';
import { object } from 'prop-types';
import { ClientUpdateAction } from '../../../shared/client-update-action.interface';
import { ActionEnum } from '../../../shared/enums';

export class PageTeamSelection extends React.Component<ITeamSelectionProps> {

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
    let content, leader, autre;
    if (this.props.player.isLeader) {
      leader = (<div className="player-selection-content">
        <div className="player-selection-header">
          Sélectionnez les membres de votre équipe!
        </div>
        {
          this.props.game.players.map(function (x, i) {
            return (<PlayerBar key={i} selected={IsPlayerInCurrentTeam(x, that.props.game)} player={x}></PlayerBar>);
          })
        }
        <div>
          <button disabled={!IsCurrentTeamComplete(this.props.game)} onClick={this.submitTeam} className="btn btn-primary">Soumettre</button>
        </div>
      </div>);
    } else {
      autre = (<div>
        En attente de la sélection du leader
      </div>);
    }
    content = (<div>
      {leader}
      {autre}
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