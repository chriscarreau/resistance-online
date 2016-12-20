import React from 'react';
import { connect } from 'react-redux';
import store from '../../store.jsx';
import Board from './board.jsx';
import HostCode from './hostCode.jsx';
import ListPlayers from './listPlayers.jsx';
import { updateGame } from '../../Actions/game-actions.js'

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
    let content = "";
    let game = this.props.game;

    if(game){
      content = (<div>
                  <Board game={game}/>
                  <HostCode code={game.gameId}/>
                  <ListPlayers players={game.players}/>
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