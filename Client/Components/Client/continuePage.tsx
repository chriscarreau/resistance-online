import { object } from 'prop-types';
import React from 'react';
import { ClientUpdateAction } from '../../../shared/client-update-action.interface';
import { ActionEnum } from '../../../shared/enums';
import { IsPremierJoueur } from '../../Utils';
import { IGameProps } from './props';

export class ContinuePage extends React.Component<IGameProps> {


    prochaineEtape() {
        let ClientAction: ClientUpdateAction = {
            playerId: globalThis.gameOptions.playerId,
            gameId: globalThis.gameOptions.gameId,
            action: ActionEnum.NEXT_STEP
        }
        globalThis.socket.emit('gameUpdate', ClientAction);
    }

    render() {
        let content = undefined;
        if (IsPremierJoueur(this.props.game)) {
            content = (<div>
                <button onClick={this.prochaineEtape} className="btn btn-primary" >Continuer</button>
            </div>);
        }
        else {
            content = "Voir le résultat sur l'écran principale";
        }
        return content;
    }
    static propTypes = {
        game: object.isRequired
    };
}
