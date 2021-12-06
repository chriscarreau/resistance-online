import { object } from "prop-types";
import React from "react";
import { IPowerChoiceProps } from "./props";
import { GetCurrentPlayer } from '../../Utils';
import { ActionEnum } from "../../../shared/enums";
import { PowerTypeEnum } from "../../../shared/power.interface";
import { ClientUpdateAction } from "../../../shared/client-update-action.interface";

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
        let powerText, powerImage;
        switch (this.props.powerType) {
            case PowerTypeEnum.StrongLeader:
                powerText = "Voulez-vous voler le prochain tour de mission ?"
                break;
            case PowerTypeEnum.NoConfidence:
                powerText = "Voulez-vous voler annuler le résultat du vote ?"
                break;
        }
        if (currentPlayer.powers.some(pow => pow.type === this.props.powerType)) {
            // TODO: Ajouter image de pouvoir ici
            content = <div>
                {powerText}
                <button onClick={() => this.choose(ActionEnum.USE_POWER)}  className="btn btn-primary">
                    Utiliser le pouvoir
                </button>
                <button onClick={() => this.choose(ActionEnum.NEXT_STEP)} className="btn btn-secondary">
                    Continuer sans utiliser le pouvoir
                </button>
            </div>;
        }
        else {
            content = <div>En attente de la décision du joueur qui a le pouvoir</div>
        }
        return content;
    }
    static propTypes = {
        game: object.isRequired
    };
}