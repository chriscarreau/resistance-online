import React from 'react';
import { IGameProps } from '../Client/props';
import { ToggleState } from '../Client/states';

export class DrawPower extends React.Component<IGameProps, ToggleState> {

  constructor(props) {
    super(props);
    this.state = {
      isToggled: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState((prevState) => ({
        isToggled: true
      }));
    }, 1000);

  }

  render() {
    return (
      <div className={"flip-card " + (this.state.isToggled ? "revealed" : "")}>
      <div className="flip-card-inner">
        <div className="flip-card-front metal-background">
          <img className="power-card-image" src="/images/question-mark.svg"/>
        </div>
        <div className="flip-card-back metal-background">
          <h1>{this.props.game.drawnPower.name}</h1>
          <p>{this.props.game.drawnPower.description}</p>
        </div>
      </div>
    </div> 
    )
  }
}
