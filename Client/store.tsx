import { createStore } from 'redux';
import gameReducer from './Reducers/gameReducer';

const store = createStore(gameReducer);

export default store