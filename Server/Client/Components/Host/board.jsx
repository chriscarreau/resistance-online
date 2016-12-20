import React from 'react';
import PastilleMission from './pastilleMission.jsx';

class Board extends React.Component {
  render() {
    return (
      <div className="board">
        <div className="missions clearfix">
          {[...Array(5)].map(function(x, i){
            var color = "white"
            return <PastilleMission key={i} color={color} isCurrentMission={i == 0} teamSize={i} />
          }
          )}
        </div>
        <div className="nb-joueurs">
          <span>{this.props.game.players.length} joueurs</span>
        </div>
        <div className="nb-joueurs-equipes">
          <span className="nb-joueur-espion">{this.props.game.spy.length} espions</span>
          <br/>
          <span className="nb-joueur-resistance">{this.props.game.resistance.length} membres de la résistance</span>
        </div>
      </div>
    )
  }
}

export default Board;