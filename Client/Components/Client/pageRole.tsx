import { object } from 'prop-types';
import React from 'react';
import { ClientUpdateAction } from '../../../shared/client-update-action.interface';
import { ActionEnum, RoleEnum } from '../../../shared/enums';
import { IPageRoleProps } from './props';
import { SpyRevealBar } from './spyRevealBar';
import { ToggleState } from './states';

export class PageRole extends React.Component<IPageRoleProps, ToggleState> {

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

  accepterRole(){
     let ClientAction: ClientUpdateAction = {
      playerId: globalThis.gameOptions.playerId,
      gameId: globalThis.gameOptions.gameId,
      action: ActionEnum.ACCEPT_ROLE
    }
    globalThis.socket.emit('gameUpdate', ClientAction);
  }

  render() {
    
    let content, imgRole, otherSpies;
    if(this.props.player.hasAcceptedRole){
      content=(<div>En attente des autres joueurs...</div>);
    }
    else{
      imgRole = this.props.player.role === RoleEnum.RESISTANCE ? "/images/Bleu.svg" : "/images/Rouge.svg";
      if (this.props.player.role === RoleEnum.SPY) {
        otherSpies = this.props.spies.map(function(spy, i){
          return (  <SpyRevealBar player={spy}/>);
          })
      }
      content = ( <div>
                      <button onClick={this.showHideRole} className={(this.state.isToggled ? "hidden" : "") + " btn btn-secondary"}>Afficher mon rôle</button>
                      <div className={(this.state.isToggled ? "" : "hidden")}>
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
  static propTypes = {
    player: object.isRequired,
    spies: object.isRequired
  };
}