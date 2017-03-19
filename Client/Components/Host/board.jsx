import React from 'react';
import PastilleMission from './pastilleMission.jsx';
import {MissionResultEnum} from '../../Utils.js';

class Board extends React.Component {
  render() {
    let nbJoueursEquipes = "";
    let game = this.props.game;
    let tmpTeamSize = [2,3,2,3,3]; 

    return (
      <div className="board">
        <div className="missions clearfix">
          {tmpTeamSize.map(function(x, i){
            var color = "white"
            let mission = game.missions[i];
            if (mission){
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
            return <PastilleMission key={i} color={color} isCurrentMission={i == game.currentMission} teamSize={x} />
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

Board.propTypes = {
  game: React.PropTypes.object
};

export default Board;