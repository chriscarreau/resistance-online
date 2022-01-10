import React from 'react';
import { GameStateEnum, MissionResultEnum } from '../../../shared/enums';
import { IGameProps } from '../Client/props';
import { PastilleMission } from './pastilleMission';

export class Board extends React.Component<IGameProps> {
  render() {
    let nbJoueursEquipes = "";
    let game = this.props.game;

    return (
      <div className="board metal-background">
        <div className="missions clearfix">
          {game.missions.map(function(mission, i){
            var color = "white"
            if (game.gameState !== GameStateEnum.KEEPING_CLOSE_EYE_CHOICE && mission){
              switch(mission.result){
                case MissionResultEnum.RESISTANCE:
                  color = "blue"
                break;
                case MissionResultEnum.SPY:
                  color = "red"
                break;
                default:
                  color = "white"
                break;
              }
            }
            return <PastilleMission key={i} color={color} isCurrentMission={i == game.currentMission} teamSize={mission.teamSize} />
          }
          )}
        </div>
        <div className="nb-joueurs">
          <span>{game.players.length} joueurs</span>
        </div>
        <div className="nb-joueurs-equipes">
          <span className="nb-joueur-espion pull-left">{game.spy.length} espions</span>
          <br/>
          <span className="nb-joueur-resistance">{game.resistance.length} membres de la résistance</span>
        </div>
      </div>
    )
  }
}