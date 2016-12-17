import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import Board from './board.jsx';
import HostCode from './hostCode.jsx';
import ListPlayers from './listPlayers.jsx';

class HostMainPage extends React.Component {

  componentDidMount() {
    window.socket.emit('newGame');
    //window.socket.on('playerJoined', this._updateGame);
    window.socket.on('gameUpdate', this._updateGame.bind(this));
  }

  _updateGame(game){
    store.dispatch({
      type: 'GAME_UPDATE',
      game: game
    });
    console.log(game);
  }

  render() {
    let content = "";

    if(this.props.game){
      content = (<div>
                  <Board game={this.props.game}/>
                  <HostCode code={this.props.game.gameId}/>
                  <ListPlayers players={this.props.game.players}/>
                </div>);
    }
    
    return (
      <div>
        {content}
      </div>);
  }
}

const mapStateToProps = function(store) {
  return {
    game: store.game
  };
}

export default connect(mapStateToProps)(HostMainPage);