import { createStore, combineReducers } from 'redux'; 
import { sessionReducer, breakReducer } from './reducers';

const rootReducer = combineReducers({
  session: sessionReducer,
  break: breakReducer,
});

const store = createStore(rootReducer);

export default store;
