// @flow
/* global Promise:true */

/**
 * @class Event
 */
export class Event {
  static id = 0;
  /**
     * @param {string} name
     * @param {Function} handler
     * @constructor
     */
  name: string;
  dispatch: Function;
  id: number;

  /**
     *
     * @param {*} name
     * @param {*} dispatch
     */
  constructor(name: string, dispatch: Function) {
    this.name = name;
    this.dispatch = dispatch;
    this.id = Event.id++;
  }
}
/**
 * @class Events
 */
export default class Events {
  static map: Object = {};

  /**
     * @param {string} name
     * @param {Function} handler
     * @return {Event}
     */
  static create = (name: string, handler: Function): Event =>
    new Event(name, handler);

  /**
     * @param {Array<Event>} handlers
     */
  static push(...handlers: Array<Event>) {
    for (let eventHandler of handlers) {
      (Events.map[eventHandler.name] =
        Events.map[eventHandler.name] || []).push(eventHandler);
    }
  }

  /**
   * @param {*} events 
   */
  static remove(...events: Array<Event>): boolean {
    for (let event of events) {
      //
      if (!(event instanceof Event)) {
        continue;
      }

      const list = Events.map[event.name];

      if (!list) {
        continue;
      }

      const l = list.length;
      let i = 0;

      for (; i < l; i++) {
        if (list[i].id === event.id) {
          list.splice(i, 1);
          break;
        }
      }
    }
  }

  /**
     * @param {string} eventName
     * @param {any} args
     * @return {Array}
     */
  static dispatch(eventName: string, ...args: Array<any>): Promise<any> {
    const list: Array<Event> = Events.map[eventName];

    if (!list || list.length === 0) {
      return Promise.resolve(null);
    }

    return Promise.all(
      list.map((eventHandle: Event): Promise<any> => {
        const res: any = eventHandle.dispatch(...args);
        return res instanceof Promise ? res : Promise.resolve(res);
      })
    );
  }
}
