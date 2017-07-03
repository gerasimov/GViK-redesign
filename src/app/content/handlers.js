// @flow
/* global window:true */

import ChannelHandler from "./../../core/channels/handler";
import eventHandler from "./../../core/events/eventHandler";
import Deferred from "./../../core/deferred";

const chrome = window.chrome;

/**
 * @param {Array} storages
 * @param {Array} methods
 * @return {Array}
 */
function createStorages(
  storages: Array<string> = ["sync", "local", "managed"],
  methods: Array<string> = ["get", "set", "remove", "clear", "getBytesInUse"]
): Array<ChannelHandler> {
  const handlers: Array<ChannelHandler> = [];
  storages.forEach((name: string) => {
    methods.forEach((method: string) => {
      const channelHandler = new ChannelHandler({
        name: `${name}.${method}`,
        handler: (data: Object): Promise<any> => {
          const deferred = new Deferred();
          if (!chrome.storage || !chrome.storage[name]) {
            return deferred.reject();
          }
          try {
            chrome.storage[name][method](data.arg, deferred.resolve);
          } catch (e) {
            deferred.reject(e);
          }
          return deferred.promise;
        }
      });
      handlers.push(channelHandler);
    });
  });
  return handlers;
}

ChannelHandler.addHandlers(
  eventHandler,
  new ChannelHandler({
    name: "fetch",
    handler: data => window.fetch(...data.args)
  }),
  new ChannelHandler({
    name: "getPath",
    handler: data => Promise.resolve(chrome.extension.getURL(data.path))
  }),
  ...createStorages()
);
