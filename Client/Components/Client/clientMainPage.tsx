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
import { GetCurrentLeader, GetCurrentPlayer, GetPlayerWithPower, GetSidePlayersOfPlayer, IsPremierJoueur } from '../../Utils';
import { ClientUpdateAction } from "../../../shared/client-update-action.interface";
import { IGameProps } from './props';
import { ActionEnum, GameStateEnum } from '../../../shared/enums';
import { object } from 'prop-types';
import { PowerChoice } from './PowerChoice';
import { PowerTypeEnum } from '../../../shared/power.interface';
import { PagePowerSelection } from './pagePowerSelection';
import { PageRoleReveal } from './pageRoleReveal';
import { PageMissionVoteReveal } from './pageMissionVoteReveal';
import { PageTakeResponsabilitySelection } from './pageTakeResponsabilitySelection';

class ClientMainPage extends React.Component<IGameProps> {

  componentDidMount() {
    //la logique de reconnection
    if (globalThis.socket.id) {
      this.joinGame();
    }
    else {
      globalThis.socket.on('connect', this.joinGame.bind(this));
    }
  }

  joinGame() {
    let oldGameOptions = JSON.parse(window.localStorage.getItem("gameOptions"));
    if (!oldGameOptions) {
      window.location.href = "/";
      return;
    }
    globalThis.gameOptions = oldGameOptions;
    globalThis.socket.on('gameUpdate', this._updateGame.bind(this));
    globalThis.socket.on('gameNotFound', this._gameNotFound.bind(this));
    globalThis.socket.emit('joinGame', globalThis.gameOptions);
    globalThis.gameOptions.playerId = globalThis.socket.id;
    globalThis.localStorage.setItem("gameOptions", JSON.stringify(globalThis.gameOptions));
  }

  _updateGame(game) {
    store.dispatch(updateGame(game));
    console.log(game);
  }

  _gameNotFound() {
    //La game ne semble pas exister côté serveur, on ramène au portail
    globalThis.localStorage.removeItem("gameOptions");
    globalThis.location.href = "/";
  }

  commencerPartie() {
    let ClientAction: ClientUpdateAction = {
      playerId: globalThis.gameOptions.playerId,
      gameId: globalThis.gameOptions.gameId,
      action: ActionEnum.START_GAME
    }
    globalThis.socket.emit('gameUpdate', ClientAction);
  }

  prochaineEtape() {
    let ClientAction: ClientUpdateAction = {
      playerId: globalThis.gameOptions.playerId,
      gameId: globalThis.gameOptions.gameId,
      action: ActionEnum.NEXT_STEP
    }
    globalThis.socket.emit('gameUpdate', ClientAction);
  }

  render() {
    let content = undefined, statusBar = undefined;
    if (this.props.game) {
      const currentLeader = GetCurrentLeader(this.props.game);
      statusBar = <StatusBar spies={this.props.game.spy} player={GetCurrentPlayer(this.props.game)}></StatusBar>;
      switch (this.props.game.gameState) {
        case GameStateEnum.NOT_STARTED:
          content = "Votre rôle sera assigné dès que la partie aura commencé";
          if (IsPremierJoueur(this.props.game)) {
            if (this.props.game.players.length >= 5) {
              content = (<div>
                <div className="instructionText">
                  Il y a présentement {this.props.game.players.length} joueurs
                </div>
                <button onClick={this.commencerPartie} className="btn btn-primary">Commencer la partie!</button>
              </div>);
            }
            else {
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
        case GameStateEnum.GIVE_POWER:
          content = <PagePowerSelection powerType={this.props.game.drawnPower.type} selectingPlayer={GetCurrentLeader(this.props.game)} players={this.props.game.players.filter(p => p.playerId !== currentLeader.playerId)} game={this.props.game} ></PagePowerSelection>
          break;
        case GameStateEnum.TAKE_RESPONSABILITY_SELECT:
          content = <PageTakeResponsabilitySelection game={this.props.game} ></PageTakeResponsabilitySelection>
          break;
        case GameStateEnum.ESTABLISH_CONFIDENCE_SELECT:
          content = <PagePowerSelection powerType={PowerTypeEnum.EstablishConfidence} selectingPlayer={GetCurrentLeader(this.props.game)} players={this.props.game.players.filter(p => p.playerId !== currentLeader.playerId)} game={this.props.game} ></PagePowerSelection>
          break;
        case GameStateEnum.ESTABLISH_CONFIDENCE_REVEAL:
          content = <PageRoleReveal playerSeeing={this.props.game.playerSelectedForPower} playerRevealing={GetCurrentLeader(this.props.game)} game={this.props.game} ></PageRoleReveal>
          break;
        case GameStateEnum.OVERHEARD_CONVERSATION_SELECT:
          const selectingPlayer = GetPlayerWithPower(this.props.game, PowerTypeEnum.OverheardConversation);
          const sidePlayers = GetSidePlayersOfPlayer(this.props.game, selectingPlayer);
          content = <PagePowerSelection powerType={PowerTypeEnum.OverheardConversation} selectingPlayer={selectingPlayer} players={sidePlayers} game={this.props.game} ></PagePowerSelection>
          break;
        case GameStateEnum.OVERHEARD_CONVERSATION_REVEAL:
          const playerRevealingRole = GetPlayerWithPower(this.props.game, PowerTypeEnum.OverheardConversation);
          content = <PageRoleReveal playerSeeing={this.props.game.playerSelectedForPower} playerRevealing={playerRevealingRole} game={this.props.game} ></PageRoleReveal>
          break;
        case GameStateEnum.OPEN_UP_SELECT:
          const openUpPlayer = GetPlayerWithPower(this.props.game, PowerTypeEnum.OpenUp);
          content = <PagePowerSelection powerType={PowerTypeEnum.OpenUp} selectingPlayer={openUpPlayer} players={this.props.game.players.filter(p => p.playerId !== openUpPlayer.playerId)} game={this.props.game} ></PagePowerSelection>
          break;
        case GameStateEnum.OPEN_UP_REVEAL:
          const openUpRevealingPlayer = GetPlayerWithPower(this.props.game, PowerTypeEnum.OpenUp);
          content = <PageRoleReveal playerSeeing={this.props.game.playerSelectedForPower} playerRevealing={openUpRevealingPlayer} game={this.props.game} ></PageRoleReveal>
          break;
        case GameStateEnum.DISTRIBUTE_ROLE:
          content = <PageRole player={GetCurrentPlayer(this.props.game)} spies={this.props.game.spy}></PageRole>
          break;
        case GameStateEnum.TEAM_SELECTION:
          content = <PageTeamSelection player={GetCurrentPlayer(this.props.game)} game={this.props.game}></PageTeamSelection>
          break;
        case GameStateEnum.OPINION_MAKER_VOTE:
          content = <PageVote isOpinionMaker={true} game={this.props.game} ></PageVote>
          break;
        case GameStateEnum.VOTE:
          content = <PageVote isOpinionMaker={false} game={this.props.game} ></PageVote>
          break;
        case GameStateEnum.VOTE_RESULT:
          content = <ContinuePage game={this.props.game} ></ContinuePage>
          break;
        case GameStateEnum.NO_CONFIDENCE_CHOICE:
          content = <PowerChoice powerType={PowerTypeEnum.NoConfidence} game={this.props.game}></PowerChoice>
          break;
        case GameStateEnum.SPOTLIGHT_CHOICE:
          content = <PowerChoice powerType={PowerTypeEnum.Spotlight} game={this.props.game}></PowerChoice>
          break;
        case GameStateEnum.SPOTLIGHT_SELECT:
          let playersWhoWillVote = this.props.game.missions[this.props.game.currentMission].currentTeam.filter(p => p.playerId !== this.props.game.playerUsingPower.playerId);
          content = <PagePowerSelection powerType={PowerTypeEnum.Spotlight} selectingPlayer={this.props.game.playerUsingPower} players={playersWhoWillVote} game={this.props.game} ></PagePowerSelection>
          break;
        case GameStateEnum.SPOTLIGHT_VOTE:
          content = <PageMission isSpotlight={true} game={this.props.game} ></PageMission>
          break;
        case GameStateEnum.MISSION:
          content = <PageMission isSpotlight={false} game={this.props.game} ></PageMission>
          break;
        case GameStateEnum.KEEPING_CLOSE_EYE_CHOICE:
          content = <PowerChoice powerType={PowerTypeEnum.KeepingCloseEyeOnYou} game={this.props.game}></PowerChoice>
          break;
        case GameStateEnum.KEEPING_CLOSE_EYE_SELECT:
          let playersWhoVoted = this.props.game.missions[this.props.game.currentMission].playerVoteFail.concat(this.props.game.missions[this.props.game.currentMission].playerVoteSuccess);
          playersWhoVoted = playersWhoVoted.filter(p => p.playerId !== this.props.game.playerUsingPower.playerId)
          playersWhoVoted.sort((a,b) => a.playerName < b.playerName ? -1 : 1 );
          content = <PagePowerSelection powerType={PowerTypeEnum.KeepingCloseEyeOnYou} selectingPlayer={this.props.game.playerUsingPower} players={playersWhoVoted} game={this.props.game} ></PagePowerSelection>
          break;
        case GameStateEnum.KEEPING_CLOSE_EYE_REVEAL:
          content = <PageMissionVoteReveal game={this.props.game} playerRevealing={this.props.game.playerSelectedForPower} playerSeeing={this.props.game.playerUsingPower} ></PageMissionVoteReveal>
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

const mapStateToProps = function (store) {
  return {
    game: store.game
  }
}

export default connect(mapStateToProps)(ClientMainPage);