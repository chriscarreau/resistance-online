import React from 'react';
import PlayerBar from './playerBar.jsx';
import {IsPlayerInCurrentTeam, GetCurrentJoueur} from '../../Utils.js';


class PageMission extends React.Component {

  vote(choice){
    let ClientAction = {
        playerId: window.gameOptions.playerId,
        gameId: window.gameOptions.gameId,
        message:choice
    }
    window.socket.emit('gameUpdate', ClientAction);
  }

  hasPlayerVoted(mission, playerId){
    for(let i = 0; i < mission.playerVoteSuccess.length; i++){
      if(mission.playerVoteSuccess[i].playerId === playerId){
        return true;
      }
    }
    for(let i = 0; i < mission.playerVoteFail.length; i++){
      if(mission.playerVoteFail[i].playerId === playerId){
        return true;
      }
    }
    return false;
  }


  render() {
    let content = "";
    let mission = this.props.game.missions[this.props.game.currentMission];
    if(this.hasPlayerVoted(mission, window.gameOptions.playerId) || !IsPlayerInCurrentTeam(GetCurrentJoueur(this.props.game), this.props.game)){
      content = "En attente des autres joueurs..."
    }
    else{
      content = ( <div>
                      <div>
                        <div onClick={() => this.vote("VOTE_SUCCESS")} className="boutton-mission-background bouton-success" >
                          <img src="/images/Success.png"/>
                        </div>
                        <div onClick={() => this.vote("VOTE_FAIL")} className="boutton-mission-background bouton-fail" >
                          <img src="/images/Reject.png"/>
                        </div>
                      </div>
                  </div>);
    }
    return (
      <div>
        {content}
      </div>
    )
  }
}

PageMission.propTypes = {
  game: React.PropTypes.object.isRequired
};


export default PageMission;