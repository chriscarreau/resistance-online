const gameReducer = function(state = {}, action) {
  switch(action.type) {
    case 'GAME_UPDATE':
        return Object.assign({}, state, { game: action.game });
  }
  return state;
}

module.exports = gameReducer;