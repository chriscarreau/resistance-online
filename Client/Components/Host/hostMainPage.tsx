import React from 'react';
import store from '../../store';
import { connect } from 'react-redux';
import { Board } from './board';
import { HostCode } from './hostCode';
import { ListPlayers } from './listPlayers';
import { VoteResult } from './voteResult';
import { MissionResult } from './missionResult';
import { updateGame } from '../../Actions/game-actions'
import { GameStateEnum } from '../../../shared/enums';
import { IGameProps } from '../Client/props';
import { DrawPower } from './drawPower';

class HostMainPage extends React.Component<IGameProps> {

  componentDidMount() {
    //logique de reconnection
    document.querySelector('body').className = "gameHostBg";
    if (globalThis.socket.id) {
      this.reconnectHost();
    }
    else {
      globalThis.socket.on('connect', this.reconnectHost.bind(this));
    }
  }

  reconnectHost() {
    let oldGameOptions = JSON.parse(window.localStorage.getItem("gameOptions"));
    if (!oldGameOptions) {
      //On est pas dans une game, on ramène au portail
      window.location.href = "/";
      return;
    }
    globalThis.gameOptions = oldGameOptions;
    globalThis.socket.on('gameUpdate', this._updateGame.bind(this));
    globalThis.socket.on('gameNotFound', this._gameNotFound.bind(this));
    globalThis.socket.emit('hostGame', globalThis.gameOptions);
  }

  _updateGame(game) {
    store.dispatch(updateGame(game));

    if (!globalThis.gameOptions.gameId) {
      //Si on a pas de gameId, on le met dans le localstorage, comme ça il va pouvoir se reconnecter en refreshant la page
      let oldGameOptions = JSON.parse(window.localStorage.getItem("gameOptions"));
      globalThis.gameOptions = oldGameOptions;
      globalThis.gameOptions.gameId = game.gameId;
      globalThis.localStorage.setItem("gameOptions", JSON.stringify(globalThis.gameOptions));
    }

    console.log(game);
  }

  _gameNotFound() {
    //La game ne semble pas exister côté serveur, on ramène au portail
    window.localStorage.removeItem("gameOptions");

    window.location.href = "/";
  }

  deleteGame() {
    globalThis.socket.emit('deleteGame', globalThis.gameOptions);
    globalThis.localStorage.removeItem("gameOptions");

    globalThis.location.href = "/";
  }


  render() {
    let content, stateContent;
    let game = this.props.game;

    if (game) {
      switch (this.props.game.gameState) {
        case GameStateEnum.VOTE_RESULT:
        case GameStateEnum.NO_CONFIDENCE_CHOICE:
          stateContent = <VoteResult game={game} />;
          break;
        case GameStateEnum.MISSION_RESULT:
          stateContent = <MissionResult game={game} />;
          break;
        case GameStateEnum.DRAW_POWER:
          stateContent = <DrawPower game={game} />;
          break;
        default:
          // All the other states just shows the list of players
          stateContent = <ListPlayers game={game} players={game.players} />;
          break;
      }
      content = (<div>
        <Board game={game} />
        <HostCode code={game.gameId} />
        {stateContent}
        <div onClick={() => this.deleteGame()} className="div-boutton-quitter">
          <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
        </div>
      </div>);
    }

    return (
      <div>
        {content}
      </div>);
  }
}

const mapStateToProps = function (store) {
  return {
    game: store.game
  };
}


export default connect(mapStateToProps)(HostMainPage);