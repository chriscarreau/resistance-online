import React from 'react';
import { GameStateEnum } from '../../../shared/enums';
import { PowerTypeEnum } from '../../../shared/power.interface';
import { HasPlayerVoted } from '../../Utils';
import { IPlayerCardProps } from '../Client/props';
import { MissionResultCard } from './missionResultCard';
import { VoteResultCard } from './voteResultCard';

export class PlayerCard extends React.Component<IPlayerCardProps> {
  render() {
    let nbMissionsBleu, nbMissionsRouge, isPlayerLeader, isLastLeader, playerVoted, powers;
    let player = this.props.player;

    if (player.nbMissionBleu > 0) {
      nbMissionsBleu = (<div className="player-mission-bleu">
        <div className="circleBase mini-pastille blue"></div>
        {player.nbMissionBleu} Missions bleu
      </div>);
    }

    if (player.nbMissionRouge > 0) {
      nbMissionsRouge = (<div className="player-mission-rouge">
        <div className="circleBase mini-pastille red"></div>
        {player.nbMissionRouge} Missions rouge
      </div>);
    }

    if (player.isLeader) {
      isPlayerLeader = (<div className="player-is-leader">
        Leader
      </div>);
    }
    if (this.props.lastLeader) {
      isLastLeader = (<div className="last-leader">
        Dernier leader
      </div>);
    }

    if (this.props.hasVoted != null) {
      playerVoted = (<span className="player-voted glyphicon glyphicon-edit" />);
    }

    if (this.props.player.powers.length > 0) {
      powers = this.props.player.powers.map(power => {
        return <div className="player-powers">
          {power.name}
        </div>;
      });
    }

    let content = (<div className={this.props.selected ? "player-selected player-card" : "player-card"}>
      <div className="player-name">
        {player.playerName}
        {playerVoted}
      </div>
      {nbMissionsBleu}
      {nbMissionsRouge}
      {powers}
      {isPlayerLeader}
      {isLastLeader}
    </div>)


    if (this.props.hasVoted !== null && this.props.player.powers.some(p => p.type === PowerTypeEnum.OpinionMaker)) {
      switch (this.props.game.gameState) {
        case GameStateEnum.VOTE:
          content = <VoteResultCard accepted={this.props.hasVoted} />
          break;
        case GameStateEnum.MISSION:
          content = <MissionResultCard success={this.props.hasVoted} />
          break;
      }
    }


    return (
      <div className="col-xs-2">
        {content}
      </div>);
  }
}