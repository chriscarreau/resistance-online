import React from 'react';
import PlayerCard from './playerCard.jsx';
import {IsPlayerInCurrentTeam, GameStateEnum, HasPlayerVoted} from '../../Utils.js';

class ListPlayers extends React.Component {

  render() {
    var that = this;
    let content = "";

    if(this.props.players){
        let showLastLeader = (that.props.game.gameState !== GameStateEnum.NOT_STARTED && that.props.game.gameState !== GameStateEnum.DISTRIBUTE_ROLE);
        content = this.props.players.map(function(x, i){
                      return <PlayerCard key={i} player={x} selected={IsPlayerInCurrentTeam(x, that.props.game)} hasVoted={HasPlayerVoted(that.props.game, x.playerId)} lastLeader={that.props.game.lastLeader === i && showLastLeader} />
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