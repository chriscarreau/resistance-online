import React from 'react';
import { PowerCard } from '../Client/powerCard';
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
        <div className="flip-card-back">
        <PowerCard powerType={this.props.game.drawnPower.type}></PowerCard>
        </div>
      </div>
    </div> 
    )
  }
}
