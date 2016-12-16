
import { createStore, combineReducers } from 'redux';
import {gameReducer} from './Reducers/gameReducer';

// const reducers = combineReducers({
//   userState: gameReducer,
//   widgetState: widgetReducer
// });

const store = createStore(gameReducer);

module.exports = store;