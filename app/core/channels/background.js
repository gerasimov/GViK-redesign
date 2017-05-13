/* eslint no-invalid-this: 0 */
/* global chrome:true */

import {
  CONTENT,
  BACKGROUND,
  INCLUDE,
} from './constants';

import Channel from './channel';
import Deferred from '../deferred';
/**
 * @class BackgroundChannel
 */
export default class BackgroundChannel extends Channel {
  /**
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * @method connect
   * @return {Promise}
   */
  connect = () => {
    const deferred = new Deferred();
    chrome.runtime.onConnect.addListener((port) => {
        (this.port = port).onMessage.addListener(this.onMessage);
        deferred.resolve(port);
    });
    return deferred.promise;
  };

  /**
   * @param {any} response
   * @return {any}
   */
  onMessage = (response: any) => Channel.onmessage.call(this, response);

  /**
   * @param {any} data
   * @param {number} to
   * @param {number} from
   * @return {Promise}
   */
  send = (data: any, to: number, from: number = BACKGROUND) => {
    const deferred = new Deferred();
    const params = {from, to, data, deferred: {id: deferred.id}};
    this.port ? this.port.postMessage(params) : deferred.reject();
    return deferred.promise;
  };

  /**
   * @param {any} data
   * @return {Promise}
   */
  sendToContent = (data) => this.send(data, CONTENT);

  /**
   * @param {any} data
   * @return {Promise}
   */
  sendToInclude = (data) => this.send(data, INCLUDE);
};
