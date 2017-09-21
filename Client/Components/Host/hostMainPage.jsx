import React from 'react';
import { connect } from 'react-redux';
import store from '../../store.jsx';
import Board from './board.jsx';
import HostCode from './hostCode.jsx';
import ListPlayers from './listPlayers.jsx';
import VoteResult from './voteResult.jsx';
import MissionResult from './missionResult.jsx';
import { updateGame } from '../../Actions/game-actions.js'
import {GameStateEnum} from '../../Utils.js';

class HostMainPage extends React.Component {

  componentDidMount() {
    //logique de reconnection
    document.querySelector('body').className = "gameHostBg";
    if(window.socket.id){
      this.reconnectHost();
    }
    else {
      window.socket.on('connect', this.reconnectHost.bind(this));
    }
  }

  reconnectHost(){
    let oldGameOptions = JSON.parse(window.localStorage.getItem("gameOptions"));
    if(!oldGameOptions){
      //On est pas dans une game, on ramène au portail
      this.context.router.push('/');
      return;
    }
    window.gameOptions = oldGameOptions;
    window.socket.on('gameUpdate', this._updateGame.bind(this));
    window.socket.on('gameNotFound', this._gameNotFound.bind(this));
    window.socket.emit('hostGame', window.gameOptions);
  }

  _updateGame(game){
    store.dispatch(updateGame(game));

    if(!window.gameOptions.gameId){
      //Si on a pas de gameId, on le met dans le localstorage, comme ça il va pouvoir se reconnecter en refreshant la page
      let oldGameOptions = JSON.parse(window.localStorage.getItem("gameOptions"));
      window.gameOptions = oldGameOptions;
      window.gameOptions.gameId = game.gameId;
      window.localStorage.setItem("gameOptions", JSON.stringify(window.gameOptions));
    }
    
    console.log(game);
  }

  _gameNotFound(){
    //La game ne semble pas exister côté serveur, on ramène au portail
    window.localStorage.removeItem("gameOptions");
    this.context.router.push('/');
  }


  render() {
    let content = "", stateContent="";
    let game = this.props.game;

    if(game){

      switch(this.props.game.gameState){
        case GameStateEnum.NOT_STARTED:
        case GameStateEnum.DISTRIBUTE_ROLE:
        case GameStateEnum.TEAM_SELECTION:
        case GameStateEnum.VOTE:
        case GameStateEnum.MISSION:
            stateContent = ( <div>
                              <ListPlayers game={game} players={game.players}/>
                            </div>);
        break;
        case GameStateEnum.VOTE_RESULT:
          stateContent = ( <div>
                              <VoteResult game={game}/>
                            </div>);
        break;
        case GameStateEnum.MISSION_RESULT:
          stateContent = ( <div>
                              <MissionResult game={game}/>
                            </div>);
        break;
        default:
        break;
      }
      content = ( <div>
                    <Board game={game}/>
                    <HostCode code={game.gameId}/>
                    {stateContent}
                  </div>);


      
    }
    
    return (
      <div>
        {content}
      </div>);
  }
}

HostMainPage.propTypes = {
  game: React.PropTypes.object
};

const mapStateToProps = function(store) {
  return {
    game: store.game
  };
}

HostMainPage.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default connect(mapStateToProps)(HostMainPage);