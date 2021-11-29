import React from 'react';

class PastilleMission extends React.Component {
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

PastilleMission.propTypes = {
  color: React.PropTypes.string.isRequired,
  teamSize: React.PropTypes.number.isRequired
}

export default PastilleMission;