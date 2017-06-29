// @flow
/* global Promise:true */

/**
 * @class Event
 */
class Event {
  /**
   * @param {string} name
   * @param {Function} handler
   * @constructor
   */
  name: string;
  dispatch: Function;

  constructor (name: string, dispatch: Function) {
    this.name = name
    this.dispatch = dispatch
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
   * @param {Array<Event>} handles
   */
  static push = (...handles: Array<Event>) => {
    handles.forEach((eventHandle: Event): any => {
      const list: Array<Event> = Events.map[eventHandle.name]
      if (!list) {
        return
      }
      list.push(eventHandle)
      Events.map[eventHandle.name] = list
    })
  };

  /**
   * @param {string} eventName
   * @param {any} args
   * @return {Array}
   */
  static dispatch = (eventName: string, ...args: Array<any>): Promise<any> => {
    const list: Array<Event> = Events.map[eventName]

    if (!list || list.length === 0) {
      return Promise.resolve(null)
    }

    return Promise.all(
      list.map((eventHandle: Event): Promise<any> => {
        const res: any = eventHandle.dispatch(...args)
        return res instanceof Promise ? res : Promise.resolve(res)
      })
    )
  };
}
