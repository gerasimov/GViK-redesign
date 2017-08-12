// @flow
import { combineReducers } from "redux";
import store from "./../store";
export const reducers = {};
const TYPE = "__gvik_mutations__";

/**
 * @param {string} type
 * @param {function} mutate
 * @param {function | null} handle
 * @return {*} Function
 */
export function createMutation(
  type: string,
  mutate: ?Function,
  handle: ?Function
): Function {
  const mutation = payload => {
    store.dispatch({ payload, type });
    return payload;
  };
  const fn = async function(...data) {
    return typeof handle === "function"
      ? await handle(mutation, ...data)
      : mutation(...data);
  };

  fn[TYPE] = { type, mutate };
  return fn;
}
/**
 * @method bindMutations
 * @param {object|array} mutationsList
 * @return {object}
 */
export function bindMutations(mutationsList: any) {
  const mutations = {};

  Object.keys(mutationsList)
    .map(k => mutationsList[k][TYPE])
    .forEach(({ type, mutate }) => (mutations[type] = mutate));

  return mutations;
}

/**
 * @param {Object} initialState
 * @param {Object} mutations
 * @return {Object}
 */
export function createReducer(initialState: any, mutations: Object) {
  return function(
    state: any = initialState,
    { type, payload }: { type: string, payload: any }
  ) {
    const mutation = mutations[type];

    if (typeof mutation !== "function") {
      return { ...state };
    }

    try {
      const data = mutation(state, payload, initialState);
      return { ...state, ...data };
    } catch (e) {
      return { ...state };
    }
  };
}

/**
 *
 * @param {String} reducerName
 * @param {any} initialState
 * @param {any} actions
 * @return {any}
 */
export function connect(
  reducerName: string,
  initialState: { [string]: any },
  actions: { [string]: Function }
) {
  reducers[reducerName] = createReducer(initialState, bindMutations(actions));
  store.replaceReducer(combineReducers(reducers));
  return actions;
}
