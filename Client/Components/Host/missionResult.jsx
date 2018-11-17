import React from 'react';
import MissionResultCard from './missionResultCard';

class MissionResult extends React.Component {

  render() {
    let content = "";
    let resultatPositif = this.props.game.missions[this.props.game.currentMission].playerVoteSuccess.map(function(x, i){
                              return <MissionResultCard key={i} success={true} />
                          });
    let resultatNegatif = this.props.game.missions[this.props.game.currentMission].playerVoteFail.map(function(x, i){
                              return <MissionResultCard key={i} success={false} />
                          });
    content = ( <div className="result-list clearfix">
    {resultatPositif}
    {resultatNegatif}
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