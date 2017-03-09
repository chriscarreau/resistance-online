import React from 'react';
import {RoleEnum} from '../../Utils.js';

class PageRole extends React.Component {

  accepterRole(){
     let ClientAction = {
      playerId:window.gameOptions.playerId,
      gameId:window.gameOptions.gameId,
      message:"ACCEPT_ROLE"
    }
    window.socket.emit('gameUpdate', ClientAction);
  }

  render() {
    
    let content = "", resistance = "", espion = "";
    if(this.props.player.hasAcceptedRole){
      content=(<div>En attente des autres joueurs...</div>);
    }
    else{
      if(this.props.player.role === RoleEnum.RESISTANCE){
        resistance = ( <div>
                      <div>
                        <img style={{width:"100%"}} src="/images/Bleu.svg"/>
                      </div>
                      <div>Membre de la résistance!</div>
                    </div>);
      }else{
        espion = ( <div>
                      <div>
                        <img style={{width:"100%"}} src="/images/Rouge.svg"/>
                      </div>
                      <div>Espion!</div>
                    </div>);
      }
      content = ( <div>
                      <div>Votre rôle est:</div>
                      {resistance}
                      {espion}
                      <div>
                        <button onClick={this.accepterRole}>J'ai pris connaissance de mon rôle</button>
                      </div>
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
  player: React.PropTypes.object.isRequired
};

export default PageRole;