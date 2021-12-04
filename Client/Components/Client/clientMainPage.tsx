import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import { updateGame } from '../../Actions/game-actions';
import { PageRole } from './pageRole';
import { PageTeamSelection } from './pageTeamSelection';
import { PageVote } from './pageVote';
import { PageMission } from './pageMission';
import { ContinuePage } from './continuePage';
import { StatusBar } from './statusBar';
import { GetCurrentJoueur, IsPremierJoueur } from '../../Utils';
import { ClientUpdateAction } from "../../../shared/client-update-action.interface";
import { IGameProps } from './props';
import { ActionEnum, GameStateEnum } from '../../../shared/enums';
import { object } from 'prop-types';
import { PowerChoice } from './PowerChoice';
import { PowerTypeEnum } from '../../../shared/power.interface';

class ClientMainPage extends React.Component<IGameProps> {

  componentDidMount() {
    //la logique de reconnection
    if(globalThis.socket.id){
      this.joinGame();
    }
    else {
      globalThis.socket.on('connect', this.joinGame.bind(this));
    }
  }

  joinGame(){
    let oldGameOptions = JSON.parse(window.localStorage.getItem("gameOptions"));
    if(!oldGameOptions){
      window.location.href = "/";
      //this.context.router.push('/');
      return;
    }
    globalThis.gameOptions = oldGameOptions;
    globalThis.socket.on('gameUpdate', this._updateGame.bind(this));
    globalThis.socket.on('gameNotFound', this._gameNotFound.bind(this));
    globalThis.socket.emit('joinGame', globalThis.gameOptions);
    globalThis.gameOptions.playerId = globalThis.socket.id;
    globalThis.localStorage.setItem("gameOptions", JSON.stringify(globalThis.gameOptions));
  }

  _updateGame(game){
    store.dispatch(updateGame(game));
    console.log(game);
  }

  _gameNotFound(){
    //La game ne semble pas exister côté serveur, on ramène au portail
    globalThis.localStorage.removeItem("gameOptions");
    globalThis.location.href = "/";
  }

  commencerPartie(){
    let ClientAction: ClientUpdateAction = {
      playerId: globalThis.gameOptions.playerId,
      gameId: globalThis.gameOptions.gameId,
      action: ActionEnum.START_GAME
    }
    globalThis.socket.emit('gameUpdate', ClientAction);
  }

  prochaineEtape(){
    let ClientAction: ClientUpdateAction = {
      playerId: globalThis.gameOptions.playerId,
      gameId: globalThis.gameOptions.gameId,
      action: ActionEnum.NEXT_STEP
    }
    globalThis.socket.emit('gameUpdate', ClientAction);
  }

  render() {
    let content = undefined, statusBar = undefined;
    if(this.props.game) {
      statusBar = <StatusBar player={GetCurrentJoueur(this.props.game)}></StatusBar>;
      switch(this.props.game.gameState){
        case GameStateEnum.NOT_STARTED:
          content = "Votre rôle sera assigné dès que la partie aura commencé";
          if(IsPremierJoueur(this.props.game)){
            if(this.props.game.players.length >= 5){
              content = (<div>
                          <div className="instructionText">
                            Il y a présentement {this.props.game.players.length} joueurs
                          </div>
                          <button onClick={this.commencerPartie} className="btn btn-primary">Commencer la partie!</button>
                        </div>);
            }
            else{
              content = "En attente des autres joueur...";
            }
          }
        break;
        case GameStateEnum.STRONG_LEADER:
          content = <PowerChoice powerType={PowerTypeEnum.StrongLeader} game={this.props.game}></PowerChoice>
        break;
        case GameStateEnum.DRAW_POWER:
          content = <ContinuePage game={this.props.game} ></ContinuePage>
        break;
        case GameStateEnum.DISTRIBUTE_ROLE:
          content = <PageRole player={GetCurrentJoueur(this.props.game)} spies={this.props.game.spy}></PageRole>
        break;
        case GameStateEnum.TEAM_SELECTION:
          content = <PageTeamSelection player={GetCurrentJoueur(this.props.game)} game={this.props.game}></PageTeamSelection>
        break;
        case GameStateEnum.VOTE:
          content = <PageVote game={this.props.game} ></PageVote>
        break;
        case GameStateEnum.VOTE_RESULT:
          content = <ContinuePage game={this.props.game} ></ContinuePage>
        break;
        case GameStateEnum.NO_CONFIDENCE_CHOICE:
          content = <PowerChoice powerType={PowerTypeEnum.NoConfidence} game={this.props.game}></PowerChoice>
        break;
        case GameStateEnum.MISSION:
          content = <PageMission game={this.props.game} ></PageMission>
        break;
        case GameStateEnum.MISSION_RESULT:
          content = <ContinuePage game={this.props.game} ></ContinuePage>
        break;
        case GameStateEnum.GAME_OVER:
          window.localStorage.removeItem("gameOptions");
        break;
        default:
        break;
      }
    }
    content = <div className="mainContent">{content}</div>
    return (
        <div className="client-main-page">
            {statusBar}
            <div className="main-client-content">
              {content}
            </div>
        </div>
    );
  }
  contextTypes = {
      router: object.isRequired
  };
}

const mapStateToProps = function(store) {
  return {
    game: store.game
  }
}

export default connect(mapStateToProps)(ClientMainPage);