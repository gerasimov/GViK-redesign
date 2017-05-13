/* eslint no-invalid-this: 0 */
/* global chrome:true */

import {
  CONTENT,
  BACKGROUND,
  INCLUDE,
  INCLUDE_SEND,
  CONTENT_SEND,
} from './constants';

import Channel from './channel';

import {
  triggerCustomEvent,
  bindCustomEvent,
} from './../../helpers';

import Deferred from '../deferred';

/**
 * @class Content
 */
export default class ContentChannel extends Channel {
  /**
   * @method constructor
   */
  constructor() {
    super();
  }

  /**
   * @method connect
   */
  connect = () => {
    bindCustomEvent(document, INCLUDE_SEND,
        (e: Event) => this.onMessage(JSON.parse(e.detail || null) || {},
            INCLUDE));

    this.port = chrome.runtime.connect();
    this.port.onMessage.addListener(
        (message: any) => this.onMessage(message, BACKGROUND));
  };

  /**
   * @param {any} response
   * @param {Number} from
   */

  onMessage = (response: any, from: number) => {
    switch (response.to) {
      case CONTENT:
        Channel.onmessage.call(this, response);
        break;
      case BACKGROUND:
      case INCLUDE:
      default:
        this.send(response, response.to, from);
        break;
    }
  };

  /**
   * @param {Object} data
   * @param {Number} to
   * @param {Number} from
   * @method send
   */

  send = (data: any, to: number, from: number = CONTENT) => {
    let params: Object;
    let promise: Promise;

    switch (from) {
      case CONTENT:
        const deferred = new Deferred();
        params = {data, to, from, deferred: {id: deferred.id}};
        promise = deferred.promise;
        break;
      case BACKGROUND:
      case INCLUDE:
      default:
        params = data;
        promise = Promise.resolve(`Resend from ${from} to ${to}`);
        break;
    }

    switch (to) {
      case INCLUDE:
        triggerCustomEvent(document, CONTENT_SEND, JSON.stringify(params));
        break;
      case BACKGROUND:
        this.port.postMessage(params);
        break;
    }
    return promise;
  };

  /**
   * @method sendToInclude
   * @param {any} data
   * @return {Promise}
   */
  sendToInclude = (data) => this.send(data, INCLUDE);

  /**
   * @method sendToBackground
   * @param {any} data
   * @return {Promise}
   */
  sendToBackground = (data) => this.send(data, BACKGROUND);
}
