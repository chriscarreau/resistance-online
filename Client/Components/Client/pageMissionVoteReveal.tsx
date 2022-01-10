import React from 'react';
import { ClientUpdateAction } from '../../../shared/client-update-action.interface';
import { ActionEnum } from '../../../shared/enums';
import { GetCurrentPlayer } from '../../Utils';
import { IPageRevealProps } from './props';
import { ToggleState } from './states';

export class PageMissionVoteReveal extends React.Component<IPageRevealProps, ToggleState> {

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
    
    let content, imgVote;
    const currentPlayer = GetCurrentPlayer(this.props.game);
    if(this.props.playerSeeing.playerId !== currentPlayer.playerId){
      content = (<div>En attente des autres joueurs...</div>);
    }
    else{
      let playerVotedSuccess = this.props.game.missions[this.props.game.currentMission].playerVoteSuccess.some(p => p.playerId === this.props.playerRevealing.playerId);

      imgVote = playerVotedSuccess ? "/images/Success.png" : "/images/Reject.png";
      content =  <div>
                      <button onClick={this.showHideRole} className={(this.state.isToggled ? "hidden" : "") + " btn btn-secondary"}>
                        Afficher le vote de {this.props.playerRevealing.playerName}
                      </button>
                      <div className={(this.state.isToggled ? "" : "hidden")}>
                        <img title={playerVotedSuccess ? "Success!" : "Fail!"} style={{width:"50vw", maxHeight:"50vh"}} onClick={this.showHideRole} src={imgVote}/>
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