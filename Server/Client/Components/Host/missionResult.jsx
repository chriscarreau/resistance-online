import React from 'react';
import PlayerCard from './playerCard.jsx';
import {IsPlayerInCurrentTeam} from '../../Utils.js';

class MissionResult extends React.Component {

  render() {
    let content = "";

    content = ( <div>
                    <div className="col-xs-12"><h2>Résultat du vote</h2></div>
                    <div className="col-xs-5">
                        {this.props.game.missions[this.props.game.currentMission].playerVoteSuccess.length} Succès
                    </div>
                    <div className="col-xs-2"><h2>VS</h2></div>
                    <div className="col-xs-5">
                        {this.props.game.missions[this.props.game.currentMission].playerVoteFail.length} Échec(s)
                    </div>
                </div>);
    
    return (
      <div>
        {content}
      </div>
    )
  }
}

MissionResult.propTypes = {
  game: React.PropTypes.object.isRequired
};

export default MissionResult;