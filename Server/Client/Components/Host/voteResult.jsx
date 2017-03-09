import React from 'react';
import PlayerCard from './playerCard.jsx';
import {IsPlayerInCurrentTeam} from '../../Utils.js';

class VoteResult extends React.Component {

  render() {
    let content = "";

    content = ( <div>
                    <div className="col-xs-12"><h2>Résultat du vote</h2></div>
                    <div className="col-xs-5">
                        {this.props.game.missions[this.props.game.currentMission].playerAccept.length} Accepté(s)
                    </div>
                    <div className="col-xs-2"><h2>VS</h2></div>
                    <div className="col-xs-5">
                        {this.props.game.missions[this.props.game.currentMission].playerReject.length} Refusé(s)
                    </div>
                </div>);
    
    return (
      <div>
        {content}
      </div>
    )
  }
}

VoteResult.propTypes = {
  game: React.PropTypes.object.isRequired
};

export default VoteResult;