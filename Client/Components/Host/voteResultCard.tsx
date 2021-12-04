import React from 'react';

export class VoteResultCard extends React.Component<{accepted: boolean}> {
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
