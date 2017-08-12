// @flow
/* global window:true */

import { ChannelHandler } from "chrome-ex";
import eventHandler from "./../../../core/events/eventHandler";
import Deferred from "./../../../core/deferred";
import { simpleFetch } from "./../../../helpers";

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

  for (let name of storages) {
    for (let method of methods) {
      handlers.push(
        new ChannelHandler({
          name: `${name}.${method}`,
          handler: (data: Object): Promise<any> => {
            const deferred = new Deferred();
            if (!chrome.storage || !chrome.storage[name]) {
              return deferred.reject();
            }

            try {
              chrome.storage[name][method](...data.args, deferred.resolve);
            } catch (e) {
              return deferred.reject(e);
            }

            return deferred.promise;
          }
        })
      );
    }
  }
  return handlers;
}

ChannelHandler.addHandlers(
  eventHandler,
  new ChannelHandler({
    name: "fetch",
    handler: ({ args, type = "text" }) => {
      const [url, data] = args;
      return simpleFetch(url, data).then(res => {
        switch (type) {
          case "json":
            return JSON.parse(res);
          default:
            return res;
        }
      });
    }
  }),
  new ChannelHandler({
    name: "getPath",
    handler: data => Promise.resolve(chrome.extension.getURL(...data.args))
  }),
  ...createStorages()
);
