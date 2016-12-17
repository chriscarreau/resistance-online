import React from 'react';

class PlayerCard extends React.Component {
  render() {
    let nbMissionsBleu = "";
    let nbMissionsRouge = "";
    let isPlayerLeader = "";

    if(this.props.player.nbMissionBleu > 0){
      nbMissionsBleu = (<div className="player-mission-bleu">
                          <div className="circleBase mini-pastille blue"></div>
                          {this.props.player.nbMissionBleu} Missions bleu
                        </div>);
    }

    if(this.props.player.nbMissionRouge > 0){
      nbMissionsRouge = ( <div className="player-mission-rouge">
                            <div className="circleBase mini-pastille red"></div>
                            {this.props.player.nbMissionRouge} Missions rouge
                          </div>);
    }
    
    if(this.props.player.isLeader){
      isPlayerLeader = (<div className="player-is-leader">
                          Leader
                        </div>);
    }

    let content = ( <div className="player-card">
                      <div className="player-name">
                        {this.props.player.playerName}
                      </div>
                      {nbMissionsBleu}
                      {nbMissionsRouge}
                      {isPlayerLeader}
                    </div>)

    return (
        <div>
          {content}
        </div>);
  }
}

export default PlayerCard;