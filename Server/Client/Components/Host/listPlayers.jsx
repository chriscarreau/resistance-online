import React from 'react';
import PlayerCard from './playerCard.jsx';

export default class ListPlayers extends React.Component {
  render() {
    let content = "";
    if(this.props.players){
        content = (     <div>
                        {this.props.players.map(function(x, i){
                            return <PlayerCard key={i} player={x} />
                        })}
                        </div>);
    }
    return (
      <div>
        {content}
      </div>
    )
  }
}