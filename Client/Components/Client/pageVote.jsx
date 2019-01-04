import React from 'react';
import {GetCurrentJoueur, HasPlayerVoted} from '../../Utils.js';


class PageVote extends React.Component {
  
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

  hasEveryoneVoted(mission, game){
    return (mission.playerAccept.length + mission.playerReject.length === game.players.length);
  }

  render() {
    let content = "";
    let mission = this.props.game.missions[this.props.game.currentMission];
    let cancelMission = "";
    let everyoneVoted = "";
    let isLeader = GetCurrentJoueur(this.props.game).isLeader;
    let playerVoted = HasPlayerVoted(this.props.game, window.gameOptions.playerId);
    if (isLeader) {
      cancelMission = <button onClick={() => this.vote("CANCEL_MISSION")} className="btn btn-danger">Changer les membres de la mission</button>
    }
    if (isLeader && this.hasEveryoneVoted(mission, this.props.game)) {
      everyoneVoted = <button onClick={() => this.vote("REVEAL_VOTE")} className="btn btn-primary">Afficher le résultat des votes</button>
    }
    if (playerVoted) {
      content = <div>
                  <div onClick={this.hideVote.bind(this)} className={(this.state.showVote ? "" : "hidden") + " vote-div"}>
                    {playerVoted === "ACCEPT" ? <img className="img-show-vote" src="/images/Checkmark.png"/> : <img className="img-show-vote" src="/images/Reject.png"/>}
                    <button onClick={() => this.vote("CANCEL_VOTE")} className="btn btn-danger">Changer mon vote</button>
                  </div>
                  En attente des autres joueurs...
                  <button onClick={() => this.showVote()} className="btn btn-secondary">Voir mon vote</button>
                  {everyoneVoted}
                </div>
    }
    else{
      content = ( <div>
                      {cancelMission}
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