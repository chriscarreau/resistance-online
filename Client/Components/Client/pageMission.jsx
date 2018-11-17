import React from 'react';
import {IsPlayerInCurrentTeam, GetCurrentJoueur} from '../../Utils.js';


class PageMission extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showVote: false
    };
  }

  vote(choice){
    let ClientAction = {
        playerId: window.gameOptions.playerId,
        gameId: window.gameOptions.gameId,
        message:choice
    }
    window.socket.emit('gameUpdate', ClientAction);
  }

  showVote(){
    this.setState((prevState) => ({
      showVote: !prevState.showVote
    }));
  }
  
  hideVote(){
    this.setState((prevState) => ({
      showVote: false
    }));
  }

  playerVoted(mission, playerId){
    for(let i = 0; i < mission.playerVoteSuccess.length; i++){
      if(mission.playerVoteSuccess[i].playerId === playerId){
        return "SUCCESS";
      }
    }
    for(let i = 0; i < mission.playerVoteFail.length; i++){
      if(mission.playerVoteFail[i].playerId === playerId){
        return "FAIL";
      }
    }
    return false;
  }

  hasEveryoneVoted(mission, game){
    return (mission.playerVoteSuccess.length + mission.playerVoteFail.length === mission.teamSize);
  }


  render() {
    let content = "";
    let mission = this.props.game.missions[this.props.game.currentMission];
    let cancelMission = "";
    let everyoneVoted = "";
    let isLeader = GetCurrentJoueur(this.props.game).isLeader;
    let playerVoted = this.playerVoted(mission, window.gameOptions.playerId);
    //S'assurer qu'on n'est pas dans le dernier round, car quand on cancel on augmente le leader
    if (isLeader && mission.currentRound !== 4) {
      cancelMission = <button onClick={() => this.vote("CANCEL_MISSION")} className="btn btn-danger">Annuler la mission et changer de leader</button>
    }
    if (isLeader && this.hasEveryoneVoted(mission, this.props.game)) {
      everyoneVoted = <button onClick={() => this.vote("REVEAL_MISSION")} className="btn btn-primary">Afficher le résultat de la mission</button>
    }

    if(!IsPlayerInCurrentTeam(GetCurrentJoueur(this.props.game), this.props.game)){
      content = <div>
                  {cancelMission}
                  Vous n'êtes pas dans la mission
                  {everyoneVoted}
                </div>
    }
    else if(playerVoted){
      content = <div>
                  <div onClick={this.hideVote.bind(this)} className={(playerVoted === "SUCCESS" ? "success" : "fail") + (this.state.showVote ? "" : " hidden") + " vote-div"}>
                    {playerVoted === "SUCCESS" ? <img className="img-show-vote" src="/images/Success.png"/> : <img className="img-show-vote" src="/images/Reject.png"/>}
                    <button onClick={() => this.vote("CANCEL_VOTE")} className="btn btn-danger">Changer mon vote</button>
                  </div>
                  En attente des autres joueurs de la mission...
                  <button onClick={() => this.showVote()} className="btn btn-secondary">Voir mon vote</button>
                  {everyoneVoted}
                </div>
    }
    else{
      content = ( <div>
                      {cancelMission}
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