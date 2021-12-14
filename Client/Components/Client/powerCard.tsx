import React from "react";
import { PowerDescriptions, PowerNames } from "../../../shared/constants";
import { PowerTypeEnum } from "../../../shared/power.interface";
import { IPowerProps } from "./props";

export class PowerCard extends React.Component<IPowerProps> {

    render() {
      let powerName, powerText;
      powerName = PowerNames[this.props.powerType];
      powerText = PowerDescriptions[this.props.powerType];
      return (
        <div className="power-card">
            <div>
                <strong>{powerName}</strong>
            </div>
            <div>
                <img src={`/images/power-icons/${PowerTypeEnum[this.props.powerType]}.png`}/>
            </div>
            {powerText}
        </div>
      )
    }
  }