import React from 'react';
import { connect } from 'react-redux';
import store from '../../store.jsx';
import { updateGame } from '../../Actions/game-actions.js';

class ClientMainPage extends React.Component {

  componentDidMount() {
    window.socket.emit('joinGame', window.gameOptions);
    //window.socket.on('playerJoined', this._updateGame);
    window.socket.on('gameUpdate', this._updateGame.bind(this));
  }

  _updateGame(game){
    store.dispatch(updateGame(game));
    console.log(game);
  }

  render() {
    return (
        <div>
            Votre rôle sera assigné dès que la partie aura commencé
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