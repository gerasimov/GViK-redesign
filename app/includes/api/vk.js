import channel, {dispatchContentHandler} from '../channel';
import waterfall from 'async/waterfall';
import Deferred from '../../core/deferred';
import {VK_APP_ID, VK_API_ROOT} from '../../../constants/index';

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
  /**
   * @param {RequestStruct} request
   */
  constructor(request: RequestStruct) {
    Object.assign(this, request);
  }

  /**
   * @param {Request} request
   * @return {Promise}
   */
  send = () => dispatchContentHandler('fetch', {args: [this.url, this.params]})
      .then((res) => JSON.parse(res));

  /**
   * @return {string}
   */
  get url() {
    return `${VK_API_ROOT}method/${this.method}`;
  }

  /**
   * @return {Object}
   */
  get params() {
    return {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(this.data),
    };
  }
}


/**
 * @class VKAPI
 * @classdesc vk api calls
 */
export default class VKAPI {
  static AppId = VK_APP_ID;

  /**
   * @method constructor
   */
  constructor() {}

  /**
   * @method call
   * @param {RequestStruct} requestData
   * @return {Promise}
   */
  call(requestData: RequestStruct) {
    const request = new Request(requestData);
    return request.send();
  }

  /**
   * @method auth
   */
  auth = () => {
    const deferred = new Deferred();
    waterfall([
      (path, clb) => channel.sendToBackground({
        handler: 'tabs.create',
        arg: {
          url: `https://oauth.vk.com/authorize?client_id=${VKAPI.AppId}&
        scope=friends&
        response_type=token`,
        },
      }).then((tab) => clb(null, tab))], (err, res) => deferred.resolve(res));
    return deferred.promise;
  };
}
