import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';

let middlewares = [thunkMiddleware];

if (process.env.NODE_ENV === 'development') {
  // const reduxLogger = require('redux-logger');
  // const logger = reduxLogger.createLogger({ collapsed: true });
  middlewares = [...middlewares];
}

const middlewareEnhancer = applyMiddleware(...middlewares);
const enhancers = [middlewareEnhancer];
const composedEnhancers = compose(...enhancers);
const store = createStore(rootReducer, undefined, composedEnhancers);
export default store;
