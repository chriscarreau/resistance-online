import React from 'react';
import PlayerBar from './playerBar.jsx';


class PageVote extends React.Component {

  vote(choice){
    let ClientAction = {
        playerId: window.gameOptions.playerId,
        gameId: window.gameOptions.gameId,
        message:choice
    }
    window.socket.emit('gameUpdate', ClientAction);
  }

  hasPlayerVoted(mission, playerId){
    for(let i = 0; i < mission.playerAccept.length; i++){
      if(mission.playerAccept[i].playerId === playerId){
        return true;
      }
    }
    for(let i = 0; i < mission.playerReject.length; i++){
      if(mission.playerReject[i].playerId === playerId){
        return true;
      }
    }
    return false;
  }

  render() {
    let content = "";
    let mission = this.props.game.missions[this.props.game.currentMission];
    if(this.hasPlayerVoted(mission, window.gameOptions.playerId)){
      content = "En attente des autres joueurs..."
    }
    else{
      content = ( <div>
                      <div>
                        <div onClick={() => this.vote("VOTE_ACCEPT")} className="boutton-vote-background" >
                          <img src="/images/Checkmark.png"/>
                        </div>
                        <div onClick={() => this.vote("VOTE_REJECT")} className="boutton-vote-background" >
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

PageVote.propTypes = {
  game: React.PropTypes.object.isRequired
};


export default PageVote;