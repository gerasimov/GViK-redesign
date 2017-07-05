// @flow
import {combineReducers} from 'redux';
import store from './../store';

export const reducers = {};
const TYPE = '__gvik_mutations__';

/**
 * @param {string} type
 * @param {function} mutate
 * @param {function | null} handle
 * @return {*} Function
 */
export function createMutation(
    type: string,
    mutate: ?Function,
    handle: ?Function): Function {
    const mutation = (...payload) => store.dispatch({payload, type});
    const fn = async (...data) =>
        typeof handle === 'function'
            ? await handle(mutation, ...data)
            : mutation(...data);

    fn[TYPE] = {type, mutate};
    return fn;
}
/**
 * @method bindMutations
 * @param {object|array} mutationsList
 * @return {object}
 */
export function bindMutations(mutationsList: any) {
    const mutations = {};

    Object.keys(mutationsList).forEach(key => {
        const mutation = mutationsList[key];

        const {
            type,
            mutate,
        }: {
            type: any,
            mutate: Function
        } = mutation[TYPE];

        mutations[type] = mutate;
    });

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
        {type, payload}: { type: string, payload: any }) => ({
            ...state,
            ...(mutations && typeof mutations[type] === 'function'
            ? mutations[type](state, payload, initialState)
            : null)
    });
}

/**
 *
 */
function updateReducer() {
    store.replaceReducer(combineReducers(reducers));
}

/**
 *
 * @param {string} name
 * @param {Function} reducer
 */
export function addReducer(name: string, reducer: Function) {
    reducers[name] = reducer;
    updateReducer();
}
/**
 *
 * @param {string} name
 */
export function removeReducer(name: string) {
    delete reducers[name];
    updateReducer();
}

/**
 *
 * @param {String} name
 * @param {any} initialState
 * @param {any} actions
 * @return {any}
 */
export function connect(
    name: string,
    initialState: { [string]: any },
    actions: { [string]: Function }) {
    addReducer(name, createReducer(initialState, bindMutations(actions)));
    return actions;
}
