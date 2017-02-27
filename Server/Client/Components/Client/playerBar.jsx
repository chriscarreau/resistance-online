import React from 'react';

class PlayerBar extends React.Component {

    onPlayerSelected(){
        let ClientAction = {
            playerId:window.gameOptions.playerId,
            gameId:window.gameOptions.gameId,
            message:"ADD_PLAYER_TEAM"
        }
        window.socket.emit('gameUpdate', ClientAction);
    }

  render() {
    return (
      <div onClick={this.onPlayerSelected} className={this.props.selected ? "player-selected playerBar": "playerBar"}>
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