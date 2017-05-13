/**
 * @class Event
 */
class Event {
  /**
   * @param {string} name
   * @param {Function} handle
   * @constructor
   */
  constructor(name, handle) {
    this.name = name;
    this.handler = handle;
  }

  /**
   * @param {any} args
   * @return {any}
   */
  dispatch = (...args) => this.handler(...args);
}

/**
 * @class Events
 */
export default class Events {
  static map = {};

  /**
   * @param {string} name
   * @param {Function} handle
   * @return {EventHandle}
   */
  static create = (name, handle) => new Event(name, handle);

  /**
   * @param {Array<EventHandle>} handles
   */
  static push = (...handles: Array<Event>) => {
    handles.forEach((eventHandle: Event) => {
      const list = Events.map[eventHandle.name] || [];
      list.push(eventHandle);
      Events.map[eventHandle.name] = list;
    });
  };

  /**
   * @param {string} eventName
   * @param {any} args
   * @return {Array}
   */
  static dispatch = (eventName: string, ...args) => {
    const list = Events.map[eventName];
    if (!list) {
      return Promise.resolve();
    }
    return Promise.all(list.map((eventHandle: Event) => {
      const res = eventHandle.dispatch(...args);
      if (res instanceof Promise) {
        return res;
      }
      return Promise.resolve(res);
    }));
  };
}
