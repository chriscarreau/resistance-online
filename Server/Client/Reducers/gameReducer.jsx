import * as types from '../Actions/action-types.js'

const gameReducer = function(state = {}, action) {
  switch(action.type) {
    case types.GAME_UPDATE:
        return Object.assign({}, state, { game: action.game });
  }
  return state;
}

module.exports = gameReducer;