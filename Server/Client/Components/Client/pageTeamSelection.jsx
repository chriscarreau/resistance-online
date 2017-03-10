import React from 'react';
import PlayerBar from './playerBar.jsx';
import {IsPlayerInCurrentTeam, RoleEnum, IsCurrentTeamComplete} from '../../Utils.js';

class PageTeamSelection extends React.Component {

  submitTeam(){
    let ClientAction = {
        playerId: window.gameOptions.playerId,
        gameId: window.gameOptions.gameId,
        message:"SUBMIT_TEAM"
    }
    window.socket.emit('gameUpdate', ClientAction);
  }

  render() {
    var that = this;
    let content = "", leader = "", autre = "";
    if(this.props.player.isLeader){
      leader = ( <div>
                    <div>
                        Sélectionnez les membres de votre équipe! 
                    </div>
                    {
                    this.props.game.players.map(function(x, i){
                        return (  <PlayerBar key={i} selected={IsPlayerInCurrentTeam(x, that.props.game)} player={x}></PlayerBar>);
                        })
                    }
                    <div>
                      <button disabled={!IsCurrentTeamComplete(this.props.game)} onClick={this.submitTeam} className="btn btn-primary">Soumettre</button>
                    </div>
                  </div>);
    }else{
      autre = ( <div>
                    En attente de la sélection du leader
                </div>);
    }
    content = ( <div>
                    {leader}
                    {autre}
                </div>);

    return (
      <div>
        {content}
      </div>
    )
  }
}

PageTeamSelection.propTypes = {
  player: React.PropTypes.object.isRequired,
  game: React.PropTypes.object.isRequired
};

export default PageTeamSelection;