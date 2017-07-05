// @flow

import {
    CONTENT,
    BACKGROUND,
    INCLUDE,
    INCLUDE_SEND,
    CONTENT_SEND,
} from './constants';

import {triggerCustomEvent, bindCustomEvent} from './../../helpers';

import Channel from './channel';
import Deferred from '../deferred';

/**
 * @class Include
 */
export default class IncludeChannel extends Channel {
    /**
     * @method connect
     * @return {any}
     */
    connect() {
        return bindCustomEvent(CONTENT_SEND, (e: CustomEvent) =>
          this.onMessage(JSON.parse(e.detail) || {}),
        );
    }

    /**
     * @method onMessage
     * @param {Object|null} response
     * @return {any}
     */
    onMessage(response: any) {
        return this._onMessage(response);
    }

    /**
     * @method send
     * @param {any} data
     * @param {number} to
     * @param {number} from
     * @param {?Object} port
     * @return {Promise}
     */
    send(data: any, to: number, from: ?number = INCLUDE, port: ?Object) {
        const deferred: Deferred = new Deferred(true);
        const params: { [string]: any } = {
            data,
            to,
            from,
            deferred: {id: deferred.id},
        };
        triggerCustomEvent(INCLUDE_SEND, JSON.stringify(params));
        return deferred.promise;
    };

    /**
     * @param {any} data
     * @method sendToBackground
     * @return {Promise}
     */
    sendToBackground(data: any) {
        return this.send(data, BACKGROUND);
    }

    /**
     * @param {any} data
     * @method sendToContent
     * @return {Promise}
     */
    sendToContent(data: any) {
        return this.send(data, CONTENT);
    }
}
