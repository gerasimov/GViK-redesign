// @flow
import { combineReducers } from "redux";
import store from "./../store";

export const reducers = {};
const TYPE = Symbol("mutation");

/**
 * @param {string} type 
 * @param {function} mutate 
 * @param {function | null} handle 
 * @return {*} Function 
 */
export function createMutation(
  type: string,
  mutate: Function,
  handle: ?Function
): Function {
  const mutation = ({ ...payload }) => store.dispatch({ payload, type });
  const fn = (...data) =>
    (typeof handle === "function" ? handle(mutation) : mutation(...data));

  fn[TYPE] = { type, mutate };
  return fn;
}
/**
 * @param {Array<Function>} mutationsList 
 * @return {Object}
 */
export function bindMutations(mutationsList) {
  const mutations = {};

  for (let i in mutationsList) {
    const mutation = mutationsList[i];
    if (!mutation) {
      continue;
    }
    const {
      type,
      mutate
    }: {
      type: any,
      mutate: Function
    } = mutation[TYPE];
    mutations[type] = mutate;
  }

  return mutations;
}

/**
 * @param {Object} initialState 
 * @param {Object} mutations 
 * @return {Object}
 */
export function createReducer(initialState: any, mutations: Object) {
  return (
    state: any = initialState,
    { type, payload }: { type: string, payload: any }
  ) => ({
    ...state,
    ...(mutations && typeof mutations[type] === "function"
      ? mutations[type](state, payload, initialState)
      : null)
  });
}

/**
 * 
 * @param {*} name 
 * @param {*} reducer 
 */
export function addReducer(name: string, reducer: Function) {
  reducers[name] = reducer;
  store.replaceReducer(combineReducers(reducers));
}
/**
 * 
 * @param {*} name 
 */
export function removeReducer(name: string) {
  delete reducers[name];
  store.replaceReducer(combineReducers(reducers));
}

/**
 * 
 * @param {*} name 
 * @param {*} initialState 
 * @param {*} actions 
 */
export function connect(name, initialState, actions) {
  addReducer(name, createReducer(initialState, bindMutations(actions)));
  return actions;
}
