// @flow
import queryString from "query-string";

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
        const body = queryString.stringify(this.data);

        return await sendToContent({
            handler: "fetch",
            type: "json",
            args: [
                url,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body
                }
            ]
        });
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
    call = async (requestData: RequestStruct) => {
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
    };

    /**
 * @method handlerError
 * @param {Object} res
 * @param {RequestStruct} request
 */
    handleError = (res: { [string]: any }, request: RequestStruct) => {
        const { error: { error_code: errorCode } } = res;

        switch (errorCode) {
        case 5:
            break;
        }
    };

    /**
   * @method auth
   * @return {string} token
   */
    auth = async () => {
        const { token } = await dispatchBackgroundHandler(
            "oauth",
            `https://oauth.vk.com/authorize?client_id=${VK_APP_ID}&scope=friends,audios&response_type=token`
        );
        await dispatchContentHandler("sync.set", {
            [VKAPI.getVKKey()]: token
        });
        return token;
    };

    /**
   * @method getToken
   * @return {string} token
   */
    getToken = async () => {
        const key = VKAPI.getVKKey();
        const tokenRes = await dispatchContentHandler("sync.get", key);

        const token = tokenRes[key];

        if (!token) {
            return await this.auth();
        }

        return token;
    };
}
