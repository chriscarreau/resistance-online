import React from 'react';
import { ClientUpdateAction } from '../../../shared/client-update-action.interface';
import { ActionEnum, RoleEnum } from '../../../shared/enums';
import { GetCurrentPlayer } from '../../Utils';
import { IPageRevealProps } from './props';
import { ToggleState } from './states';

export class PageRoleReveal extends React.Component<IPageRevealProps, ToggleState> {

  constructor(props) {
    super(props);
    this.state = {
      isToggled: false
    };
  }

  showHideRole = () => {
    this.setState((prevState) => ({
      isToggled: !prevState.isToggled
    }));
  }

  continue(){
     let ClientAction: ClientUpdateAction = {
      playerId: globalThis.gameOptions.playerId,
      gameId: globalThis.gameOptions.gameId,
      action: ActionEnum.NEXT_STEP
    }
    globalThis.socket.emit('gameUpdate', ClientAction);
  }

  render() {
    
    let content, imgRole;
    const currentPlayer = GetCurrentPlayer(this.props.game);
    if(this.props.playerSeeing.playerId !== currentPlayer.playerId){
      content = (<div>En attente des autres joueurs...</div>);
    }
    else{
      imgRole = this.props.playerRevealing.role === RoleEnum.RESISTANCE ? "/images/Bleu.svg" : "/images/Rouge.svg";
      content =  <div>
                      <button onClick={this.showHideRole} className={(this.state.isToggled ? "hidden" : "") + " btn btn-secondary"}>
                        Afficher le rôle de {this.props.playerRevealing.playerName}
                      </button>
                      <div className={(this.state.isToggled ? "" : "hidden")}>
                        <img style={{width:"50vw", maxHeight:"50vh"}} onClick={this.showHideRole} src={imgRole}/>
                      </div>
                      <button onClick={this.continue} className="btn btn-primary">Continuer</button>
                  </div>;
    }
    
    return (
      <div>
        {content}
      </div>
    )
  }
}