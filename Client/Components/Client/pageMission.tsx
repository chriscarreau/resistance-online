import { object } from 'prop-types';
import React from 'react';
import { ClientUpdateAction } from '../../../shared/client-update-action.interface';
import { ActionEnum } from '../../../shared/enums';
import { PowerTypeEnum } from '../../../shared/power.interface';
import { IsPlayerInCurrentTeam, GetCurrentPlayer, HasPlayerVoted, GetAllPlayersWithPower, GetPlayerWithPower } from '../../Utils';
import { IPageMissionProps } from './props';
import { ToggleState } from './states';


export class PageMission extends React.Component<IPageMissionProps, ToggleState> {

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

  hasEveryoneVoted(mission){
    return (mission.playerVoteSuccess.length + mission.playerVoteFail.length === mission.teamSize);
  }

  render() {
    let content;
    let mission = this.props.game.missions[this.props.game.currentMission];
    let cancelMission;
    let everyoneVoted;
    const currentPlayer = GetCurrentPlayer(this.props.game);
    let isLeader = currentPlayer.isLeader;
    let playerVoted = HasPlayerVoted(this.props.game, globalThis.gameOptions.playerId);
    if (isLeader && this.hasEveryoneVoted(mission)) {
      everyoneVoted = <button onClick={() => this.vote(ActionEnum.REVEAL_MISSION)} className="btn btn-primary">Afficher le résultat de la mission</button>
    }

    if(!IsPlayerInCurrentTeam(GetCurrentPlayer(this.props.game), this.props.game)){
      content = <div>
                  {cancelMission}
                  Vous n'êtes pas dans la mission
                  {everyoneVoted}
                </div>
    }
    else if(playerVoted != null){
      content = <div>
                  <div onClick={this.hideVote.bind(this)} className={(playerVoted === true ? "success" : "fail") + (this.state.isToggled ? "" : " hidden") + " vote-div"}>
                    {playerVoted === true ? <img className="img-show-vote" src="/images/Success.png"/> : <img className="img-show-vote" src="/images/Reject.png"/>}
                    <button onClick={() => this.vote(ActionEnum.REVEAL_VOTE)} className="btn btn-danger">Changer mon vote</button>
                  </div>
                  En attente des autres joueurs de la mission...
                  <button onClick={() => this.showVote()} className="btn btn-secondary">Voir mon vote</button>
                  {everyoneVoted}
                </div>
    }
    else{
      if (this.props.isSpotlight) {
        let spotlightPlayer = this.props.game.playerSelectedForPower;
        if (spotlightPlayer.playerId === currentPlayer.playerId) {
          content = ( <div>
            {cancelMission}
            <div>
              <div onClick={() => this.vote(ActionEnum.VOTE_SUCCESS)} className="boutton-mission-background bouton-success" >
                <img src="/images/Success.png"/>
              </div>
              <div onClick={() => this.vote(ActionEnum.VOTE_FAIL)} className="boutton-mission-background bouton-fail" >
                <img src="/images/Reject.png"/>
              </div>
            </div>
        </div>);
        }
        else {
          content = <div>En attente du choix de {spotlightPlayer.playerName}</div>
        }
      }
      else {
        content = ( <div>
                        {cancelMission}
                        <div>
                          <div onClick={() => this.vote(ActionEnum.VOTE_SUCCESS)} className="boutton-mission-background bouton-success" >
                            <img src="/images/Success.png"/>
                          </div>
                          <div onClick={() => this.vote(ActionEnum.VOTE_FAIL)} className="boutton-mission-background bouton-fail" >
                            <img src="/images/Reject.png"/>
                          </div>
                        </div>
                    </div>);
      }
    }
    return (
      <div className="center-content">
        {content}
      </div>
    )
  }
  static propTypes = {
    game: object.isRequired
  };
}