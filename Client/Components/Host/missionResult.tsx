import React from 'react';
import { IGameProps } from '../Client/props';
import { MissionResultCard } from './missionResultCard';

export class MissionResult extends React.Component<IGameProps> {

  render() {
    let content;
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
