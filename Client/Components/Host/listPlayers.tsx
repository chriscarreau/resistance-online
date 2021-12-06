import React from 'react';
import { PlayerCard } from './playerCard';
import { IsPlayerInCurrentTeam, HasPlayerVoted, IsPlayerSelectedForPower } from '../../Utils';
import { IPlayersProps } from '../Client/props';
import { GameStateEnum } from '../../../shared/enums';

export class ListPlayers extends React.Component<IPlayersProps> {

  render() {
    var that = this;
    let content;

    if (this.props.players) {
      let showLastLeader = (that.props.game.gameState !== GameStateEnum.NOT_STARTED && that.props.game.gameState !== GameStateEnum.DISTRIBUTE_ROLE);
      content = this.props.players.map(function (x, i) {
        const isSelected = IsPlayerSelectedForPower(x, that.props.game) || IsPlayerInCurrentTeam(x, that.props.game);
        return <PlayerCard key={i} game={that.props.game} player={x} selected={isSelected} hasVoted={HasPlayerVoted(that.props.game, x.playerId)} lastLeader={that.props.game.lastLeader === i && showLastLeader} />
      });
    }
    return (
      <div className="list-players">
        {content}
      </div>
    )
  }
}
