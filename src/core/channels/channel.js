// @flow
import Deferred from '../deferred';
import ChannelHandler from './handler';

import {override} from 'core-decorators';
/**
 * @class Channel
 */
export default class Channel {
    _onMessage: Function;

    /**
     * @override
     */
    send(
      data: any,
      to: number,
      from: ?number,
      port: ?Object = null): Promise<any> {
        return Promise.resolve();
    }

    /**
     * @method onmessage
     * @param {any} response
     * @param {any} port
     * @return {any}
     */
    _onMessage(response: Object, port: any) {
        const {data, deferred, from} = response;
        const {handler} = data;

        if (!handler) {
            return Deferred.runByType(data.deferred, data.result);
        }

        if (port) {
            data.tab = port.sender.tab;
        }

        const resultHandle = (type: string) => (result: any) =>
          this.send(
            {result, deferred: {id: deferred.id, type}},
            from,
            undefined,
            port,
          );

        return ChannelHandler.callHandler(handler, data).
                              then(resultHandle('resolve')).
                              catch(resultHandle('reject'));
    }

    self({
             handler,
             args,
         }: {
        handler: any,
        args: Array<any>
    }): Promise<any> {
        const deferred = new Deferred();
        return ChannelHandler.callHandler(handler, {
            args,
        }).then(deferred.resolve).catch(deferred.reject);
    };
}
