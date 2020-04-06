import React from 'react';
import {RoleEnum} from '../../Utils.js';
import SpyRevealBar from './spyRevealBar.jsx';

class PageRole extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showRole: false
    };
  }

  showHideRole = () => {
    this.setState((prevState) => ({
      showRole: !prevState.showRole
    }));
  }

  accepterRole(){
     let ClientAction = {
      playerId:window.gameOptions.playerId,
      gameId:window.gameOptions.gameId,
      message:"ACCEPT_ROLE"
    }
    window.socket.emit('gameUpdate', ClientAction);
  }

  render() {
    
    let content = "", imgRole = "", otherSpies = "";
    if(this.props.player.hasAcceptedRole){
      content=(<div>En attente des autres joueurs...</div>);
    }
    else{
      imgRole = this.props.player.role === RoleEnum.RESISTANCE ? "/images/Bleu.svg" : "/images/Rouge.svg";
      if (this.props.player.role === RoleEnum.SPY) {
        otherSpies = this.props.spies.map(function(spy, i){
          return (  <SpyRevealBar spy={spy}/>);
          })
      }
      content = ( <div>
                      <button onClick={this.showHideRole} className={(this.state.showRole ? "hidden" : "") + " btn btn-secondary"}>Afficher mon rôle</button>
                      <div className={(this.state.showRole ? "" : "hidden")}>
                        <img style={{width:"50vw", maxHeight:"50vh"}} onClick={this.showHideRole} src={imgRole}/>
                        {otherSpies}
                      </div>
                      <button onClick={this.accepterRole} className="btn btn-primary">J'ai pris connaissance de mon rôle</button>
                  </div>);
    }
    
    return (
      <div>
        {content}
      </div>
    )
  }
}

PageRole.propTypes = {
  player: React.PropTypes.object.isRequired,
  spies: React.PropTypes.object.isRequired
};

export default PageRole;