import React from 'react';
import PlayerBar from './playerBar.jsx';

class PageTeamSelection extends React.Component {

  isPlayerInCurrentTeam(player){
      let team = this.props.game.missions[this.props.game.currentMission].currentTeam;
      for(var i = 0; i < team.length; i++){
        if(team[i].playerId === player.playerId){
            return true;
        }
      }
      return false;
  }

  render() {
    var that = this;
    var RoleEnum = {
        SPY : 0,
        RESISTANCE : 1
    }
    let content = "", leader = "", autre = "";
    if(this.props.player.isLeader){
      leader = ( <div>
                    <div>
                        Sélectionnez les membres de votre équipe! 
                    </div>
                    {
                    this.props.game.players.map(function(x, i){
                        let playerBar = "";
                        if(x !== that.props.player){
                            playerBar = (  <PlayerBar key={i} selected={that.isPlayerInCurrentTeam(x)} player={x}></PlayerBar>)
                        }
                        return playerBar;
                        })
                    }
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