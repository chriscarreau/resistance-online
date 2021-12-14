import { object } from "prop-types";
import React from "react";
import { IPowerChoiceProps } from "./props";
import { GetCurrentPlayer } from '../../Utils';
import { ActionEnum } from "../../../shared/enums";
import { PowerDescriptions, PowerNames } from "../../../shared/constants";
import { PowerTypeEnum } from "../../../shared/power.interface";
import { ClientUpdateAction } from "../../../shared/client-update-action.interface";
import { PowerCard } from "./powerCard";

export class PowerChoice extends React.Component<IPowerChoiceProps> {

    choose(choice: ActionEnum) {
        let ClientAction: ClientUpdateAction = {
            playerId: globalThis.gameOptions.playerId,
            gameId: globalThis.gameOptions.gameId,
            action: choice
        }
        globalThis.socket.emit('gameUpdate', ClientAction);
    }

    render() {
        let content = undefined;
        const currentPlayer = GetCurrentPlayer(this.props.game);
        if (currentPlayer.powers.some(pow => pow.type === this.props.powerType)) {
            content = <div className="center-content">
                <PowerCard powerType={this.props.powerType}></PowerCard>
                <button onClick={() => this.choose(ActionEnum.USE_POWER)}  className="btn btn-primary">
                    Utiliser le pouvoir
                </button>
                <button onClick={() => this.choose(ActionEnum.NEXT_STEP)} className="btn btn-secondary">
                    Continuer sans utiliser le pouvoir
                </button>
            </div>;
        }
        else {
            content = <div className="center-content">
                En attente de la décision du joueur qui a le pouvoir
                <PowerCard powerType={this.props.powerType}></PowerCard>
                </div>
        }
        return content;
    }
    static propTypes = {
        game: object.isRequired
    };
}