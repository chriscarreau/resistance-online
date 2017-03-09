import React from 'react';
import PlayerCard from './playerCard.jsx';
import {IsPlayerInCurrentTeam} from '../../Utils.js';

class ListPlayers extends React.Component {

  render() {
    var that = this;
    let content = "";

    if(this.props.players){
        content = this.props.players.map(function(x, i){
                      return <PlayerCard key={i} player={x} selected={IsPlayerInCurrentTeam(x, that.props.game)} />
                  });
    }
    return (
      <div className="list-players">
        {content}
      </div>
    )
  }
}

ListPlayers.propTypes = {
  game: React.PropTypes.object.isRequired
};

export default ListPlayers;