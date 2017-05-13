/* eslint no-invalid-this: 0 */
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
export type ChannelHandlerStruct = {
  name: string,
  handler: Function
};

/**
 * @class ChannelHandler
 */
export default class ChannelHandler {
  static handlers = {};

  /**
   * @constructor
   * @param {ChannelHandlerStruct} handler
   */
  constructor(handler: ChannelHandlerStruct) {
    this.handler = handler.handler;
    this.name = handler.name;
  }

  /**
   * @param {ChannerlHanlder} handler
   */
  static addHandler = (handler: ChannelHandler) => {
    ChannelHandler.handlers[handler.name] = handler.handler;
  };

  /**
   * @param {Array} handlers
   */
  static addHandlers = (...handlers: Array<ChannelHandler>) => {
    handlers.forEach(ChannelHandler.addHandler);
  };

  /**
   * @param {ChannerlHanlder} handler
   * @param {any} data
   * @return {Promise}
   */
  static callHandler = (handler: any, data: any) => {
    const name = isObject(handler) ? handler.name : handler;
    const handlerFunc = ChannelHandler.handlers[name];
    if (!isFunction(handlerFunc)) {
      return Promise.reject('Not implemented');
    }
    return handlerFunc(data);
  };
}
