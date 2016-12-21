import React from 'react';
import PastilleMission from './pastilleMission.jsx';

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
            return <PastilleMission key={i} color={color} isCurrentMission={i == 0} teamSize={x} />
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

export default Board;