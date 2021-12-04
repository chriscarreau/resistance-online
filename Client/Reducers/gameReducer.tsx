import types from '../Actions/action-types'

const gameReducer = function(state = {}, action) {
  switch(action.type) {
    case types.GAME_UPDATE:
        return Object.assign({}, state, { game: action.game });
  }
  return state;
}

export default gameReducer;