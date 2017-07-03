// @flow
import {
  sendToContent,
  dispatchBackgroundHandler,
  dispatchContentHandler
} from "../channel";

import { VK_APP_ID, VK_API_ROOT } from "./../../../../constants/";

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
  constructor(request: RequestStruct) {
    this.data = request.data;
    this.method = request.method;
  }

  /**
   * @param {Request} request
   * @return {Promise}
   */
  send = async (): Promise<any> => {
    const url = `${VK_API_ROOT}method/${this.method}`;
    const body = JSON.stringify(this.data);

    return await sendToContent({
      handler: "fetch",
      args: [
        url,
        {
          method: "POST",
          credentials: "include",
          body
        }
      ]
    }).then((res: string): Object => JSON.parse(res));
  };
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
  call = async (requestData: RequestStruct) =>
    await new Request(requestData).send();

  /**
   * @method auth
   */
  auth = async () => {
    const { token } = await dispatchBackgroundHandler("oauth", {
      args: [
        `https://oauth.vk.com/authorize?client_id=${VK_APP_ID}&scope=friends,audios&response_type=token`
      ]
    });
    await dispatchContentHandler("sync.set", {
      arg: {
        [VKAPI.getVKKey()]: token
      }
    });
    return token;
  };
  getToken = async () => {
    const key = VKAPI.getVKKey();
    const tokenRes = await dispatchContentHandler("sync.get", {
      arg: key
    });

    const token = tokenRes[key];

    if (!token) {
      return await this.auth();
    }

    return token;
  };
}
