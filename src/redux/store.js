import { createStore, combineReducers } from 'redux';
import timerReducer from './reducers';

const rootReducer = combineReducers({
  timer: timerReducer,
});

const store = createStore(rootReducer);

export default store;
