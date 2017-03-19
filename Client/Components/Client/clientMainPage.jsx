import React from 'react';
import { connect } from 'react-redux';
import store from '../../store.jsx';
import { updateGame } from '../../Actions/game-actions.js';
import PageRole from './pageRole.jsx';
import PageTeamSelection from './pageTeamSelection.jsx';
import PageVote from './pageVote.jsx';
import PageMission from './pageMission.jsx';
import {GameStateEnum, GetCurrentJoueur, IsPremierJoueur} from '../../Utils.js';

class ClientMainPage extends React.Component {

  componentDidMount() {
    //mettre ici la logique de reconnection
    if(window.socket.id){
      this.joinGame();
    }
    else {
      window.socket.on('connect', this.joinGame.bind(this));
    }
    
  }

  joinGame(){
    let oldGameOptions = JSON.parse(window.localStorage.getItem("gameOptions"));
    // console.log("oldGameOptions");
    // console.log(oldGameOptions);
    if(!oldGameOptions){
      this.context.router.push('/');
      return;
    }
    window.gameOptions = oldGameOptions;
    window.socket.emit('joinGame', window.gameOptions);
    // console.log("window.socket.id");
    // console.log(window.socket.id);
    window.gameOptions.playerId = window.socket.id;
    window.socket.on('gameUpdate', this._updateGame.bind(this));
    // console.log("window.gameOptions");
    // console.log(window.gameOptions);
    // console.log("JSON.stringify(window.gameOptions)");
    // console.log(JSON.stringify(window.gameOptions));
    window.localStorage.setItem("gameOptions", JSON.stringify(window.gameOptions));
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

  prochaineEtape(){
    let ClientAction = {
      playerId:window.gameOptions.playerId,
      gameId:window.gameOptions.gameId,
      message:"NEXT_STEP"
    }
    window.socket.emit('gameUpdate', ClientAction);
  }

  render() {
    let content = "";
    if(this.props.game){
      switch(this.props.game.gameState){
        case GameStateEnum.NOT_STARTED:
          content = "Votre rôle sera assigné dès que la partie aura commencé";
          if(IsPremierJoueur(this.props.game)){
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
          content = <PageRole player={GetCurrentJoueur(this.props.game)}></PageRole>
        break;
        case GameStateEnum.TEAM_SELECTION:
          content = <PageTeamSelection player={GetCurrentJoueur(this.props.game)} game={this.props.game}></PageTeamSelection>
        break;
        case GameStateEnum.VOTE:
          content = <PageVote game={this.props.game} ></PageVote>
        break;
        case GameStateEnum.VOTE_RESULT:
          if(IsPremierJoueur(this.props.game)){
            content = ( <div>
                          <button onClick={this.prochaineEtape}>Prochaine étape</button>
                        </div>);
          }
          else{
            content = "CHECK LE RESULTAT SU'A GROSSE ECRAN";
          }
        break;
        case GameStateEnum.MISSION:
          content = <PageMission game={this.props.game} ></PageMission>
        break;
        case GameStateEnum.MISSION_RESULT:
          if(IsPremierJoueur(this.props.game)){
            content = ( <div>
                          <button onClick={this.prochaineEtape}>Prochaine étape</button>
                        </div>);
          }
          else{
            content = "CHECK LE RESULTAT SU'A GROSSE ECRAN";
          }
        break;
        case GameStateEnum.GAME_OVER:
          window.localStorage.removeItem("gameOptions");
        break;
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

ClientMainPage.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default connect(mapStateToProps)(ClientMainPage);