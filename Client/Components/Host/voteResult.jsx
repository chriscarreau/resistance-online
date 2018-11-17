import React from 'react';
import VoteResultCard from './voteResultCard';

class VoteResult extends React.Component {

  render() {
    let content = "";
    let resultatPositif = this.props.game.missions[this.props.game.currentMission].playerAccept.map(function(x, i){
                              return <VoteResultCard key={i} accepted={true} />
                          });
    let resultatNegatif = this.props.game.missions[this.props.game.currentMission].playerReject.map(function(x, i){
                              return <VoteResultCard key={i} accepted={false} />
                          });
    content = ( <div  className="result-list clearfix">
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

VoteResult.propTypes = {
  game: React.PropTypes.object.isRequired
};

export default VoteResult;