import React from 'react';

class PlayerCard extends React.Component {
  render() {
    let nbMissionsBleu = "";
    let nbMissionsRouge = "";
    let isPlayerLeader = "";
    let isLastLeader = "";
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

    let content = ( <div className={this.props.selected ? "player-selected player-card" : "player-card"}>
                      <div className="player-name">
                        {player.playerName}
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

PlayerCard.propTypes = {
  player: React.PropTypes.object.isRequired,
  selected: React.PropTypes.bool.isRequired,
  lastLeader: React.PropTypes.bool
};

export default PlayerCard;