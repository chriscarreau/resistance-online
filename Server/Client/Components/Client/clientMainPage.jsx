import React from 'react';

class ClientMainPage extends React.Component {
  
  constructor(props) {
      super(props);
      this.state = {
        game: {}
      };
  }

  componentDidMount() {
    window.socket.emit('joinGame', window.gameOptions);
    //window.socket.on('playerJoined', this._updateGame);
    window.socket.on('gameUpdate', this._updateGame.bind(this));
  }
  _updateGame(game){
    this.setState({game:game});
    console.log(game);
  }
  render() {
    return (
        <div>
            allo du client
        </div>
    );
  }
}

export default ClientMainPage;