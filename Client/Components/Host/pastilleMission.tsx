import React from 'react';
import { IPastilleProps } from '../Client/props';

export class PastilleMission extends React.Component<IPastilleProps> {
  render() {
    let pastille = (<div className={`circleBase pastilleMission ${this.props.color} ${this.props.isCurrentMission ? "active" : ""}`}>
                      {this.props.teamSize ? this.props.teamSize : '0'}
                    </div>);
    let currentMissionIndicator;

    if(this.props.isCurrentMission){
      currentMissionIndicator = (<div className="triangle"></div>);
    }

    return <div className="pastilleContainer" >{pastille}{currentMissionIndicator}</div>;
  }
}