
import { createStore, combineReducers } from 'redux';
import gameReducer from './Reducers/gameReducer.jsx';

const store = createStore(gameReducer);

module.exports = store;