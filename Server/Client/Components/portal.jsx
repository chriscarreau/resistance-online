import React from 'react';
import browserHistory from 'react-router'

class Portal extends React.Component {
  render() {
    return (
      <div className="portal-div">
        <h1>Welcome to resistance online !</h1>
        <div className="portal-form" id="joinForm">
            <div className="form-group">
                <label htmlFor="roomName">Room code</label>
                <input type="text" className="form-control" id="roomName" placeholder="Code..." />
            </div>
            <div className="form-group">
                <label htmlFor="playerName">Username</label>
                <input type="text" className="form-control" id="playerName" placeholder="Username..." />
            </div>
        </div>
        <div>
            <button onClick={this.btnJoinGameClick.bind(this)} className="btn btn-primary btn-portal" id="btnJoinGameForm">Join a game</button>
            <hr/>
            <button onClick={this.btnCreateGameClick.bind(this)} className="btn btn-primary btn-portal" id="btnCreateGame">Create a game</button>
        </div>
      </div>
    )
  }

  btnCreateGameClick(e) {
      this.context.router.push('/host');
  }
  btnJoinGameClick(e) {
        window.gameOptions = {
            gameId:         document.querySelector('#roomName').value,
            playerName:     document.querySelector('#playerName').value,
            playerId:       socket.id
        }
        this.context.router.push('/client');
  }
}

Portal.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Portal;