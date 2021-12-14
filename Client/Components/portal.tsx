import React from 'react';
export class Portal extends React.Component {


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
    if(oldGameOptions.isHost) {
      window.location.href = '/host';
    }
    else{
      window.location.href = '/client';
    }
  }

  render() {
    return (
      <div className="portal-div">
        <h1>Résistance</h1>
        <div className="portal-form" id="joinForm">
            <div className="form-group">
                <label htmlFor="roomName">Partie #</label>
                <input type="text" className="form-control" id="roomName" placeholder="Partie #..." onKeyPress={this.handleKeyPress} />
            </div>
            <div className="form-group">
                <label htmlFor="playerName">Nom d'utilisateur</label>
                <input type="text" className="form-control" id="playerName" placeholder="Nom d'utilisateur..." maxLength={15} onKeyPress={this.handleKeyPress}/>
            </div>
        </div>
        <div>
            <button onClick={this.btnJoinGameClick.bind(this)} className="btn btn-primary btn-portal" id="btnJoinGameForm">Rejoindre une partie</button>
            <hr/>
            <button onClick={this.btnCreateGameClick.bind(this)} className="btn btn-primary btn-portal" id="btnCreateGame">Créer une partie</button>
        </div>
        <div className="version-number">
        v2.0.0
        </div>
      </div>
    )
  }

  btnCreateGameClick(e) {
      globalThis.gameOptions = {
        isHost:         true
      }
      window.localStorage.setItem("gameOptions", JSON.stringify(globalThis.gameOptions));
      window.location.href = '/host';
  }

  btnJoinGameClick = () => {
      this.joinGame();
  }

  joinGame = () => {
    if(this.validateInput()){
      globalThis.gameOptions = {
          gameId:         (document.querySelector('#roomName') as HTMLInputElement).value.toUpperCase(),
          playerName:     (document.querySelector('#playerName') as HTMLInputElement).value,
          playerId:       globalThis.socket.id,
          isHost:         false
      }
      window.localStorage.setItem("gameOptions", JSON.stringify(globalThis.gameOptions));
      window.location.href = '/client';
    }
    else{
      //Todo afficher que le gars est dumb
    }
  }

  validateInput(){
    let playerName = (document.querySelector('#playerName')as HTMLInputElement).value;
    if(playerName.length < 1 || playerName.length > 15){
      return false;
    }
    return true;
  }
}