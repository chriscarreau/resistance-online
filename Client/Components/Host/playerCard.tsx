import React from 'react';
import { IPlayerCardProps } from '../Client/props';

export class PlayerCard extends React.Component<IPlayerCardProps> {
  render() {
    let nbMissionsBleu;
    let nbMissionsRouge;
    let isPlayerLeader;
    let isLastLeader;
    let playerVoted;
    let player = this.props.player;

    if(player.nbMissionBleu > 0){
      nbMissionsBleu = (<div className="player-mission-bleu">
                          <div className="circleBase mini-pastille blue"></div>
                          {player.nbMissionBleu} Missions bleu
                        </div>);
    }

    if(player.nbMissionRouge > 0){
      nbMissionsRouge = ( <div className="player-mission-rouge">
                            <div className="circleBase mini-pastille red"></div>
                            {player.nbMissionRouge} Missions rouge
                          </div>);
    }
    
    if(player.isLeader){
      isPlayerLeader = (<div className="player-is-leader">
                          Leader
                        </div>);
    }
    if(this.props.lastLeader){
      isLastLeader = (<div className="last-leader">
                        Dernier leader
                      </div>);
    }

    if (this.props.hasVoted != null){
      playerVoted = (<span className="player-voted glyphicon glyphicon-edit"/>);
    }

    let content = ( <div className={this.props.selected ? "player-selected player-card" : "player-card"}>
                      <div className="player-name">
                        {player.playerName}
                        {playerVoted}
                      </div>
                      {nbMissionsBleu}
                      {nbMissionsRouge}
                      {isPlayerLeader}
                      {isLastLeader}
                    </div>)

    return (
        <div className="col-xs-2">
          {content}
        </div>);
  }
}