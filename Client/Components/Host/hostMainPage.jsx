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
    window.socket.emit('newGame');
    //window.socket.on('playerJoined', this._updateGame);
    window.socket.on('gameUpdate', this._updateGame.bind(this));
  }

  _updateGame(game){
    store.dispatch(updateGame(game));
    console.log(game);
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

export default connect(mapStateToProps)(HostMainPage);