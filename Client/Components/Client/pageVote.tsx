import { object } from 'prop-types';
import React from 'react';
import { ClientUpdateAction } from '../../../shared/client-update-action.interface';
import { ActionEnum } from '../../../shared/enums';
import { PowerTypeEnum } from '../../../shared/power.interface';
import {GetAllPlayersWithPower, GetCurrentPlayer, HasPlayerVoted} from '../../Utils';
import { IPageVoteProps } from './props';
import { ToggleState } from './states';


export class PageVote extends React.Component<IPageVoteProps, ToggleState> {
  
  constructor(props) {
    super(props);
    this.state = {
      isToggled: false
    };
  }

  vote(choice: ActionEnum){
    let ClientAction: ClientUpdateAction = {
        playerId: globalThis.gameOptions.playerId,
        gameId: globalThis.gameOptions.gameId,
        action: choice
    }
    globalThis.socket.emit('gameUpdate', ClientAction);
  }

  showVote(){
    this.setState((prevState) => ({
      isToggled: !prevState.isToggled
    }));
  }
  
  hideVote(){
    this.setState((prevState) => ({
      isToggled: false
    }));
  }

  hasEveryoneVoted(mission, game){
    return (mission.playerAccept.length + mission.playerReject.length === game.players.length);
  }

  render() {
    let content;
    let mission = this.props.game.missions[this.props.game.currentMission];
    let cancelMission;
    let everyoneVoted;
    const currentPlayer = GetCurrentPlayer(this.props.game);
    let isLeader = currentPlayer.isLeader;
    let playerVoted = HasPlayerVoted(this.props.game, globalThis.gameOptions.playerId);
    if (isLeader) {
      cancelMission = <button onClick={() => this.vote(ActionEnum.CANCEL_MISSION)} className="btn btn-danger">Changer les membres de la mission</button>
    }
    if (isLeader && this.hasEveryoneVoted(mission, this.props.game)) {
      everyoneVoted = <button onClick={() => this.vote(ActionEnum.REVEAL_VOTE)} className="btn btn-primary">Afficher le résultat des votes</button>
    }
    if (playerVoted != null) {
      content = <div>
                  <div onClick={this.hideVote.bind(this)} className={(this.state.isToggled ? "" : "hidden") + " vote-div"}>
                    {playerVoted === true ? <img className="img-show-vote" src="/images/Checkmark.png"/> : <img className="img-show-vote" src="/images/Reject.png"/>}
                    <button onClick={() => this.vote(ActionEnum.CANCEL_VOTE)} className="btn btn-danger">Changer mon vote</button>
                  </div>
                  En attente des autres joueurs...
                  <button onClick={() => this.showVote()} className="btn btn-secondary">Voir mon vote</button>
                  {everyoneVoted}
                </div>
    }
    else{
      if (this.props.isOpinionMaker) {
        let opinionMakers = GetAllPlayersWithPower(this.props.game, PowerTypeEnum.OpinionMaker);
        if (opinionMakers.includes(currentPlayer)) {
          content = ( <div>
            {cancelMission}
            <div>
              <div onClick={() => this.vote(ActionEnum.VOTE_ACCEPT)} className="boutton-vote-background" >
                <img src="/images/Checkmark.png"/>
              </div>
              <div onClick={() => this.vote(ActionEnum.VOTE_REJECT)} className="boutton-vote-background" >
                <img src="/images/Reject.png"/>
              </div>
            </div>
        </div>);
        }
        else {
          content = <div>En attente {opinionMakers.length > 1 ? "des leaders" : "du leader"} d'opinion</div>
        }
      }
      else {
        content = ( <div>
          {cancelMission}
          <div>
            <div onClick={() => this.vote(ActionEnum.VOTE_ACCEPT)} className="boutton-vote-background" >
              <img src="/images/Checkmark.png"/>
            </div>
            <div onClick={() => this.vote(ActionEnum.VOTE_REJECT)} className="boutton-vote-background" >
              <img src="/images/Reject.png"/>
            </div>
          </div>
      </div>);
      }
    }
    return (
      <div>
        {content}
      </div>
    )
  }
  static propTypes = {
    game: object.isRequired
  };
}
