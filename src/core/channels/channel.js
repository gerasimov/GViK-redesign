// @flow
import Deferred from "../deferred";
import ChannelHandler from "./handler";

/**
 * @class Channel
 */
export default class Channel {
  send: Function;

  /**
   * @method onmessage
   * @param {any} response
   * @param {any} port
   * @return {any}
   */
  _onMessage(response: Object, port: any) {
    const { data, deferred, from } = response;
    const { handler } = data;

    if (!handler) {
      return Deferred.runByType(data.deferred, data.result);
    }

    if (port) {
      data.tab = port.sender.tab;
    }

    const resultHandle = (type: string) => (result: any) => {
      this.send(
        { result, deferred: { id: deferred.id, type } },
        from,
        undefined,
        port
      );
    };
    return ChannelHandler.callHandler(handler, data)
      .then(resultHandle("resolve"))
      .catch(resultHandle("reject"));
  }

  self = ({
    handler,
    args
  }: {
    handler: any,
    args: Array<any>
  }): Promise<any> => {
    const deferred = new Deferred();
    return ChannelHandler.callHandler(handler, {
      args
    })
      .then(deferred.resolve)
      .catch(deferred.reject);
  };
}
