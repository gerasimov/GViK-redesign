// @flow

import {
  sendToContent,
  dispatchBackgroundHandler,
  dispatchContentHandler
} from "../channel";

import { VK_APP_ID, VK_API_ROOT } from "./../../../../constants/";
import { stringifyParams } from "./../../../helpers";
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
  async send(): Promise<any> {
    return await sendToContent({
      handler: "fetch",
      type: "json",
      args: [
        `${VK_API_ROOT}method/${this.method}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: stringifyParams(this.data)
        }
      ]
    });
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
  async call(requestData: RequestStruct) {
    const token = await this.getToken();

    if (!token) {
      return Promise.reject("Unexpected error");
    }

    const { method, data } = requestData;
    const request = new Request({
      method,
      data: {
        ...data,
        access_token: token
      }
    });
    let res = await request.send();

    if (res.error) {
      return this.handleError(res, request);
    }

    return res;
  }

  /**
     * @method handlerError
     * @param {Object} res
     * @param {RequestStruct} request
     */
  handleError(res: { [string]: any }, request: RequestStruct) {
    const { error: { error_code: errorCode } } = res;

    switch (errorCode) {
      case 5:
        break;
    }
  }

  /**
     * @method auth
     * @return {string} token
     */
  async auth() {
    const { token } = await dispatchBackgroundHandler(
      "oauth",
      `https://oauth.vk.com/authorize?${stringifyParams({
        client_id: VK_APP_ID,
        scope: ["friends", "audios"],
        response_type: "token"
      })}`
    );
    await dispatchContentHandler("sync.set", {
      [VKAPI.getVKKey()]: token
    });
    return token;
  }

  /**
     * @method getToken
     * @return {string} token
     */
  async getToken() {
    const key = VKAPI.getVKKey();
    const tokenRes = await dispatchContentHandler("sync.get", key);

    const token = tokenRes[key];

    if (!token) {
      return await this.auth();
    }

    return token;
  }
}
