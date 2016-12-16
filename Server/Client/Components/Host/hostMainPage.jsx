import React from 'react';
import Board from './board.jsx';
import HostCode from './hostCode.jsx';
import ListPlayers from './listPlayers.jsx';

export default class HostMainPage extends React.Component {
  
  constructor(props) {
      super(props);
      this.state = {
        game: {}
      };
  }

  componentDidMount() {
    window.socket.emit('newGame');
    //window.socket.on('playerJoined', this._updateGame);
    window.socket.on('gameUpdate', this._updateGame.bind(this));
  }

  _updateGame(game){
    this.setState({game:game});
    console.log(game);
  }

  render() {
    let content = "";
    if(this.state.game){
      content = (<div>
                  <Board game={this.state.game}/>
                  <HostCode code={this.state.game.gameId}/>
                  <ListPlayers players={this.state.game.players}/>
                </div>);
    }
    return (
      <div>
        {content}
      </div>);
  }
}