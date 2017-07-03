// @flow
/* global window,Promise */

import { CONTENT, BACKGROUND, INCLUDE } from "./constants";

import Channel from "./channel";
import Deferred from "../deferred";

/**
 * @class PortManager
 */
class PortManager {
  ports: Object = {};
  current: ?any = null;

  /**
   *
   */
  push = port => {
    this.ports[port.sender.tab.id] = port;
    this.current = port;
  };

  /**
   *
   */
  remove = port => {
    if (this.current === port) {
      this.current = Object.values(this.ports).slice(-1).pop();
    }
    delete this.ports[port.sender.tab.id];
  };

  /**
   *
   */
  all = (clb: Function): Array<Promise<any>> =>
    Object.values(this.ports).map(clb);
}

/**
 * @class BackgroundChannel
 */
export default class BackgroundChannel extends Channel {
  static ports: PortManager = new PortManager();
  ports: PortManager;
  onmessage: Function;

  /**
   * @constructor
   */
  constructor(...args: any[]) {
    super(...args);
    this.ports = BackgroundChannel.ports;
  }

  /**
   * @method connect
   */
  connect = () =>
    window.chrome.runtime.onConnect.addListener((port: any) => {
      port.onMessage.addListener(this.onMessage);
      port.onDisconnect.addListener(() => this.ports.remove(port));
      this.ports.push(port);
    });

  /**
   * @param {any} response
   * @param {any} port
   * @return {any}
   */
  onMessage = (response: any, port: any) => this._onMessage(response, port);

  /**
   * @param {any} data
   * @param {number} to
   * @param {number} from
   * @param {any} port
   * @return {Promise<any>}
   */
  send = (
    data: any,
    to: number,
    from: number = BACKGROUND,
    port: ?Object = null
  ): Promise<any> => {
    const deferred: Deferred = new Deferred(true);
    const params: Object = {
      from,
      to,
      data,
      deferred: { id: deferred.id }
    };

    if (port) {
      port.postMessage(params);
    } else if (this.ports.current) {
      this.ports.current.postMessage(params);
    } else {
      deferred.reject();
    }
    return deferred.promise;
  };

  /**
   * @param {any} data
   * @param {number} to
   * @return {Promise<any>}
   */
  send2All = (data: any, to: number): Promise<any> =>
    Promise.all(
      this.ports.all((port: any): Promise<any> =>
        this.send(data, to, BACKGROUND, port)
      )
    );

  /**
   * @param {any} data
   * @return {Promise}
   */
  sendToAllContent = (data: any): Promise<any> => this.send2All(data, CONTENT);

  /**
   * @param {any} data
   * @return {Promise}
   */
  sendToAllInclude = (data: any): Promise<any> => this.send2All(data, INCLUDE);

  /**
   * @param {any} data
   * @return {Promise}
   */
  sendToContent = (data: any): Promise<any> => this.send(data, CONTENT);

  /**
   * @param {any} data
   * @return {Promise}
   */
  sendToInclude = (data: any): Promise<any> => this.send(data, INCLUDE);
}
