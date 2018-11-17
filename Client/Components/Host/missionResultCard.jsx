import React from 'react';

class MissionResultCard extends React.Component {
  render() {
    

    let content = ( <div className={(this.props.success ? "success" : "fail") + " result-card"}>
                      <img style={{width:"100%"}} src={this.props.success ? "/images/Success.png" : "/images/Reject.png"}/>
                    </div>)

    return (
        <div className="col-xs-2">
          {content}
        </div>);
  }
}

MissionResultCard.propTypes = {
  success: React.PropTypes.bool.isRequired
};

export default MissionResultCard;