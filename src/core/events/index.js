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
     * @param {Array<Event>} handles
     */
    static push = (...handles: Array<Event>) => {
        handles.forEach((eventHandle: Event): any => {
            const list: Array<Event> = Events.map[eventHandle.name] || [];

            list.push(eventHandle);
            Events.map[eventHandle.name] = list;
        });
    };

    static remove = (...events: Array<Event>): boolean => {
        const res = events.filter((event) => {
            if (!(event instanceof Event)) {
                return false;
            }

            const list = Events.map[event.name];

            if (!list || !list.length) {
                return false;
            }

            return list.some((curEvent: Event, index) => {
                if (curEvent.id === event.id) {
                    list.splice(index, 1);
                    return true;
                }
            });
        });
        return res.length === events.length;
    };

    /**
     * @param {string} eventName
     * @param {any} args
     * @return {Array}
     */
    static dispatch = (
      eventName: string,
      ...args: Array<any>): Promise<any> => {
        const list: Array<Event> = Events.map[eventName];

        if (!list || list.length === 0) {
            return Promise.resolve(null);
        }

        return Promise.all(
          list.map((eventHandle: Event): Promise<any> => {
              const res: any = eventHandle.dispatch(...args);
              return res instanceof Promise ? res : Promise.resolve(res);
          }),
        );
    };
}
