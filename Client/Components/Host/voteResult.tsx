import React from 'react';
import { IGameProps } from '../Client/props';
import { VoteResultCard } from './voteResultCard';

export class VoteResult extends React.Component<IGameProps> {

  render() {
    let content;
    let resultatPositif = this.props.game.missions[this.props.game.currentMission].playerAccept.map(function(x, i){
                              return <div className="col-xs-2"><VoteResultCard key={i} accepted={true} /></div>
                          });
    let resultatNegatif = this.props.game.missions[this.props.game.currentMission].playerReject.map(function(x, i){
                              return <div className="col-xs-2"><VoteResultCard key={i} accepted={false} /></div>
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