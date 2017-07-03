/* global chrome */

import ChannelHandler from "./../../../core/channels/handler";
import Deferred from "./../../../core/deferred";

const tbs = chrome.tabs;
const deferrify = fn => ({ args }) => {
  const deferred = new Deferred();
  fn(...args, deferred.resolve);
  return deferred.promise;
};
const handlers = tbs
  ? [
      new ChannelHandler({
        name: "tabs.create",
        handler: deferrify(tbs.create)
      }),

      new ChannelHandler({
        name: "tabs.get",
        handler: deferrify(tbs.get)
      })
    ]
  : null;

export default handlers;
