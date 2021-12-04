import { IGame } from '../../shared/game.interface';
import types from './action-types';

export function updateGame(game: IGame) {
    return {
        type: types.GAME_UPDATE,
        game: game
    }
}