import React from 'react';

export class MissionResultCard extends React.Component<{success: boolean}> {
  render() {
    

    let content = ( <div className={(this.props.success ? "success" : "fail") + " result-card"}>
                      <img style={{width:"100%"}} src={this.props.success ? "/images/Success.png" : "/images/Reject.png"}/>
                    </div>)

    return (
        <div>
          {content}
        </div>);
  }
}
