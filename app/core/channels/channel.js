import Deferred from '../deferred';
import ChannelHandler from './handler';

/**
 * @class Channel
 */
export default class Channel {
  /**
   * @method onmessage
   * @param {any} response
   * @return {any}
   */
  static onmessage(response) {
    const {data, deferred, from} = response;
    const {handler} = data;

    if (!handler) {
      return Deferred.runByType(data.deferred, data.result);
    }

    const resultHandle = (type) =>
        (result) =>
            this.send({result, deferred: {id: deferred.id, type}}, from);
    delete data.handler;
    ChannelHandler.callHandler(handler, data)
                  .then(resultHandle('resolve'))
                  .catch(resultHandle('reject'));
  };
}
