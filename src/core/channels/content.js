// @flow
/* global window:true */

import {
    CONTENT,
    BACKGROUND,
    INCLUDE,
    INCLUDE_SEND,
    CONTENT_SEND,
} from './constants';
import {autobind} from 'core-decorators';
import {triggerCustomEvent, bindCustomEvent} from './../../helpers';

import Channel from './channel';
import Deferred from '../deferred';

@autobind
/**
 * @class Content
 */
export default class ContentChannel extends Channel {
    static disconnected: boolean = false;
    port: any;

    /**
     * @method connect
     */
    connect(): void {
        if (ContentChannel.disconnected) {
            return;
        }
        bindCustomEvent(INCLUDE_SEND, (e: CustomEvent): any =>
            this.onMessage(JSON.parse(e.detail)),
        );

        this.port = window.chrome.runtime.connect();
        this.port.onMessage.addListener(this.onMessage);
        this.port.onDisconnect.addListener(ContentChannel.onDisconnect);
    }

    /**
     *
     */
    static onDisconnect() {
        ContentChannel.disconnected = true;
    }

    /**
     * @param {any} response
     * @return {any}
     */
    onMessage(response: any) {
        const {from, to} = response;

        switch(to) {
        case CONTENT:
            return this._onMessage(response);
        case BACKGROUND:
        case INCLUDE:
        default:
            return this.send(response, to, from);
        }
    }

    /**
     * @param {Object} data
     * @param {Number} to
     * @param {Number} from
     * @param {any} port
     * @return {Promise}
     * @method send
     */
    send(
        data: any, to: number, from: ?number = CONTENT,
        port: ?Object): Promise<any> {
        let params: Object | any;

        const deferred: Deferred = new Deferred(true);

        switch(from) {
        case CONTENT:
            params = {data, to, from, deferred: {id: deferred.id}};
            break;
        case BACKGROUND:
        case INCLUDE:
        default:
            params = data;
            deferred.resolve(`Resend from ${from || ''} to ${to}`);
            break;
        }

        switch(to) {
        case INCLUDE:
            triggerCustomEvent(CONTENT_SEND, JSON.stringify(params));
            break;
        case BACKGROUND:
            if (ContentChannel.disconnected) {
                return deferred.reject();
            }
            this.port.postMessage(params);
            break;
        default:
            break;
        }
        return deferred.promise;
    }

    /**
     * @method sendToInclude
     * @param {any} data
     * @return {Promise}
     */
    sendToInclude(data: any): Promise<any> {
        return this.send(data, INCLUDE);
    }

    /**
     * @method sendToBackground
     * @param {any} data
     * @return {Promise}
     */
    sendToBackground(data: any): Promise<any> {
        return this.send(data, BACKGROUND);
    }
}
