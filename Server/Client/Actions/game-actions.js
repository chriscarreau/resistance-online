import * as types from './action-types.js';

export function updateGame(game) {
    return {
        type: types.GAME_UPDATE,
        game: game
    }
}