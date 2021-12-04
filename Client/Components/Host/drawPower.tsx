import React from 'react';
import { IGameProps } from '../Client/props';

export class DrawPower extends React.Component<IGameProps> {

  render() {    
    return (
      <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front metal-background">
          <img src="/images/question-mark.svg"/>
        </div>
        <div className="flip-card-back .metal-background">
          <h1>{this.props.game.drawnPower.name}</h1>
          <p>{this.props.game.drawnPower.description}</p>
        </div>
      </div>
    </div> 
    )
  }
}
