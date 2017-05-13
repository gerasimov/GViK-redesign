/* eslint no-invalid-this: 0 */

import {
  CONTENT,
  BACKGROUND,
  INCLUDE,
  INCLUDE_SEND,
  CONTENT_SEND,
} from './constants';

import {
  triggerCustomEvent,
  bindCustomEvent,
} from './../../helpers';

import Channel from './channel';
import Deferred from '../deferred';
/**
 * @class Include
 */
export default class IncludeChannel extends Channel {
  /**
   * @method constructor
   */
  constructor() {
    super();
  }

  /**
   * @method connect
   * @return {any}
   */
  connect = () => bindCustomEvent(document, CONTENT_SEND, (e) =>
      this.onMessage(JSON.parse(e.detail || null) || {}));

  /**
   * @method onMessage
   * @param {Object|null} response
   * @return {any}
   */
  onMessage = (response: any) => Channel.onmessage.call(this, response);

  /**
   * @method send
   * @param {any} data
   * @param {number} to
   * @param {number} from
   * @return {Promise}
   */
  send = (data: any, to: number, from: number = INCLUDE) => {
    const deferred = new Deferred();
    const params = {data, to, from, deferred: {id: deferred.id}};
    triggerCustomEvent(document, INCLUDE_SEND, JSON.stringify(params));
    return deferred.promise;
  };

  /**
   * @param {any} data
   * @method sendToBackground
   * @return {Promise}
   */
  sendToBackground = (data: any) => this.send(data, BACKGROUND);

  /**
   * @param {any} data
   * @method sendToContent
   * @return {Promise}
   */
  sendToContent = (data: any) => this.send(data, CONTENT);
}
