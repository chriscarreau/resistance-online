import React from 'react';

class PlayerBar extends React.Component {

    onPlayerSelected(){
        let ClientAction = {
            playerId:this.props.player.playerId,
            gameId:window.gameOptions.gameId,
            action:"ADD_REMOVE_PLAYER_TEAM"
        }
        window.socket.emit('gameUpdate', ClientAction);
    }

  render() {
    return (
      <div onClick={this.onPlayerSelected.bind(this)} className={this.props.selected ? "player-selected player-bar": "player-bar"}>
        <div>{this.props.player.playerName}</div>
      </div>
    )
  }
}

PlayerBar.propTypes = {
  player: React.PropTypes.object.isRequired,
  selected: React.PropTypes.bool.isRequired
};

export default PlayerBar;