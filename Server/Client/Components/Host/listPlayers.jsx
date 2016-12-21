import React from 'react';
import PlayerCard from './playerCard.jsx';

class ListPlayers extends React.Component {
  render() {
    let content = "";

    if(this.props.players){
        content = this.props.players.map(function(x, i){
                      return <PlayerCard key={i} player={x} />
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
  players: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
};

export default ListPlayers;