import React from 'react';
import { connect } from 'react-redux';
import store from '../../store.jsx';
import { updateGame } from '../../Actions/game-actions.js';
import PageRole from './pageRole.jsx';

class ClientMainPage extends React.Component {

  componentDidMount() {
    //mettre ici la logique de reconnection
    window.socket.emit('joinGame', window.gameOptions);
    window.socket.on('gameUpdate', this._updateGame.bind(this));
  }

  _updateGame(game){
    store.dispatch(updateGame(game));
    console.log(game);
  }

  commencerPartie(){
    let ClientAction = {
      playerId:window.gameOptions.playerId,
      gameId:window.gameOptions.gameId,
      message:"START_GAME"
    }
    window.socket.emit('gameUpdate', ClientAction);
  }

  getCurrentJoueur(){
    for(let joueur of this.props.game.players){
      if(joueur.playerId === window.gameOptions.playerId){
        return joueur;
      }
    }
    return null;
  }

  isPremierJoueur(){
    if(this.props.game){
      return (this.props.game.firstPlayer.playerId == window.socket.id);
    }
    return false;
  }

  render() {
    let content = "";
    var GameStateEnum = {
      NOT_STARTED : 0,
      DISTRIBUTE_ROLE : 1,
      TEAM_SELECTION : 2,
      VOTE : 3,
      VOTE_RESULT : 4,
      MISSION : 5,
      MISSION_RESULT : 6,
      GAME_OVER : 7
  }
    if(this.props.game){
      switch(this.props.game.gameState){
        case GameStateEnum.NOT_STARTED:
          content = "Votre rôle sera assigné dès que la partie aura commencé";
          if(this.isPremierJoueur()){
            if(this.props.game.players.length >= 5){
              content = (<div>
                          <div>
                            Il y a présentement {this.props.game.players.length} joueurs
                          </div>
                          <div>
                            <button onClick={this.commencerPartie} className="btn btn-primary">Commencer la partie!</button>
                          </div>
                        </div>);
            }
            else{
              content = "En attente des autres joueur...";
            }
          }
        break;
        case GameStateEnum.DISTRIBUTE_ROLE:
          content = <PageRole player={this.getCurrentJoueur()}></PageRole>
        default:
        break;
      }
    }
    return (
        <div>
            {content}
        </div>
    );
  }
}

const mapStateToProps = function(store) {
  return {
    game: store.game
  }
}

export default connect(mapStateToProps)(ClientMainPage);