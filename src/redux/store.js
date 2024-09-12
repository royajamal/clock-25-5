import { createStore, combineReducers } from 'redux'; 
import sessionReducer from './reducers'; 
import breakReducer from './reducers'; 

const rootReducer = combineReducers({
  session: sessionReducer,
  break: breakReducer
});


const store = createStore(rootReducer);

export default store;