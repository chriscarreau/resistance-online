import React from 'react';
import browserHistory from 'react-router'

class Portal extends React.Component {
  
  componentDidMount() {
    this.reconnect();
  }

  handleKeyPress = (event) => {
    if (event.key == 'Enter'){
      this.joinGame();
    }
  }

  reconnect(){
    let oldGameOptions = JSON.parse(window.localStorage.getItem("gameOptions"));
    
    if(!oldGameOptions){
      //Y'a rien dans le local storage, on est pas dans une game
      //donc on fait rien et la page de connection s'affiche
      return;
    }
    if(oldGameOptions.isHost){
      this.context.router.push('/host');
    }
    else{
      this.context.router.push('/client');
    }
  }

  render() {
    return (
      <div className="portal-div">
        <h1>Bienvenue au jeu de Résistance en ligne!</h1>
        <div className="portal-form" id="joinForm">
            <div className="form-group">
                <label htmlFor="roomName">Partie #</label>
                <input type="text" className="form-control" id="roomName" placeholder="Partie #..." onKeyPress={this.handleKeyPress} />
            </div>
            <div className="form-group">
                <label htmlFor="playerName">Nom d'utilisateur</label>
                <input type="text" className="form-control" id="playerName" placeholder="Nom d'utilisateur..." maxLength="15" onKeyPress={this.handleKeyPress}/>
            </div>
        </div>
        <div>
            <button onClick={this.btnJoinGameClick.bind(this)} className="btn btn-primary btn-portal" id="btnJoinGameForm">Rejoindre une partie</button>
            <hr/>
            <button onClick={this.btnCreateGameClick.bind(this)} className="btn btn-primary btn-portal" id="btnCreateGame">Créer une partie</button>
        </div>
      </div>
    )
  }

  btnCreateGameClick(e) {
      window.gameOptions = {
        isHost:         true
      }
      this.context.router.push('/host');
      window.localStorage.setItem("gameOptions", JSON.stringify(window.gameOptions));
  }

  btnJoinGameClick = () => {
      this.joinGame();
  }

  joinGame = () => {
    if(this.validateInput()){
      window.gameOptions = {
          gameId:         document.querySelector('#roomName').value.toUpperCase(),
          playerName:     document.querySelector('#playerName').value,
          playerId:       window.socket.id,
          isHost:         false
      }
      window.localStorage.setItem("gameOptions", JSON.stringify(window.gameOptions));
      this.context.router.push('/client');
    }
    else{
      //Todo afficher que le gars est dumb
    }
  }

  validateInput(){
    let playerName = document.querySelector('#playerName').value;
    if(playerName.length < 1 || playerName.length > 15){
      return false;
    }
    return true;
  }
}

Portal.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Portal;