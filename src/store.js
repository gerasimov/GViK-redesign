import { createStore, applyMiddleware, compose } from "redux";

let composeEnhancers = compose;
const middlewares = [];

if (process.env.NODE_ENV !== "production") {
  if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});
  }
}
const enhancer = composeEnhancers(applyMiddleware(...middlewares));
const store = createStore(x => x, enhancer);

export default store;
