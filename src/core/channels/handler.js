// @flow
/* global Promise:true */

export type ChannelHandlerStruct = {
  name: string,
  handler: Function
};

/**
 * @class ChannelHandler
 */
export default class ChannelHandler {
  static handlers: { [string]: Function } = {};
  handler: Function;
  name: string;

  /**
   * @constructor
   * @param {ChannelHandlerStruct} handler
   */
  constructor (handler: ChannelHandlerStruct) {
    this.handler = handler.handler
    this.name = handler.name
  }

  /**
   * @param {ChannerlHanlder} handler
   */
  static addHandler = (handler: ChannelHandler) => {
    ChannelHandler.handlers[handler.name] = handler.handler
  };

  /**
   * @param {Array} handlers
   */
  static addHandlers = (...handlers: Array<ChannelHandler>) => {
    handlers.forEach(ChannelHandler.addHandler)
  };

  /**
   * @param {ChannerlHanlder} handler
   * @param {any} data
   * @return {Promise}
   */
  static callHandler = (
    handler: ChannelHandlerStruct | string,
    data: any
  ): Promise<any> => {
    if (!handler) {
      return Promise.reject(new Error())
    }
    const name: string = typeof handler === 'string' ? handler : handler.name
    const handlerFunc: Function = ChannelHandler.handlers[name]

    if (typeof handlerFunc !== 'function') {
      return Promise.reject(new Error('Not implemented'))
    }
    return handlerFunc(data)
  };
}
