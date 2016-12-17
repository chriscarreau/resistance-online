import React from 'react';
import PastilleMission from './pastilleMission.jsx';

class Board extends React.Component {
  render() {
    return (
      <div className="board">
        <div className="missions clearfix">
          {[...Array(5)].map(function(x, i){
            var color = "white"
            return <PastilleMission key={i} color={color} isCurrentMission={i == 2} teamSize={i} />
          }
          )}
        </div>
        <div className="nb-joueurs">
          <span>10 joueurs</span>
        </div>
        <div className="nb-joueurs-equipes">
          <span className="nb-joueur-espion">10 espions</span>
          <br/>
          <span className="nb-joueur-resistance">10 membres de la résitances</span>
        </div>
      </div>
    )
  }
}

export default Board;