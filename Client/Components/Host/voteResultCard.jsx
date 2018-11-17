import React from 'react';

class VoteResultCard extends React.Component {
  render() {
    

    let content = ( <div className="result-card grey">
                      <img style={{width:"100%"}} src={this.props.accepted ? "/images/Checkmark.png" : "/images/Reject.png"}/>
                    </div>)

    return (
        <div className="col-xs-2">
          {content}
        </div>);
  }
}

VoteResultCard.propTypes = {
  accepted: React.PropTypes.bool.isRequired
};

export default VoteResultCard;