// @flow
import {
  sendToContent,
  dispatchBackgroundHandler,
  dispatchContentHandler
} from '../channel'

import { VK_APP_ID, VK_API_ROOT } from './../../../../constants/'

/**
 * @type Request
 */
export type RequestStruct = {
  method: string,
  data: Object
};
/**
 * @class Request
 */
export class Request {
  method: string;
  data: Object;
  /**
   * @param {RequestStruct} request
   */
  constructor (request: RequestStruct) {
    this.data = request.data
    this.method = request.method
  }

  /**
   * @param {Request} request
   * @return {Promise}
   */
  send = (): Promise<any> =>
    sendToContent({
      handler: 'fetch',
      args: [this.url, this.params]
    }).then((res: string): Object => JSON.parse(res));

  get url (): string {
    return `${VK_API_ROOT}method/${this.method}`
  }

  /**
   * @return {Object}
   */
  get params (): Object {
    return {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(this.data)
    }
  }
}

/**
 * @class VKAPI
 * @classdesc vk api calls
 */
export default class VKAPI {
  static getVKKey = () => `vk${window.vk.id}`;
  /**
   * @method call
   * @param {RequestStruct} requestData
   * @return {Promise}
   */
  call = (requestData: RequestStruct) => new Request(requestData).send();

  /**
   * @method auth
   */
  auth = () =>
    dispatchBackgroundHandler('oauth', {
      args: [
        `https://oauth.vk.com/authorize?client_id=${VK_APP_ID}&scope=friends,audios&response_type=token`
      ]
    }).then(({ token }) => {
      dispatchContentHandler('sync.set', {
        arg: {
          [VKAPI.getVKKey()]: token
        }
      })
      return token
    });

  getToken = async () => {
    const key = VKAPI.getVKKey()
    return await dispatchContentHandler('sync.get', {
      arg: key
    }).then(res => {
      const token = res[key]
      if (token) {
        return token
      }
      return this.auth()
    })
  };
}
