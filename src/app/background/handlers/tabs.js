/* global chrome */

import { ChannelHandler } from "chrome-ex";
import { promisify } from "./../../../core/deferred";

const tbs = chrome.tabs;

const handlers = tbs
  ? [
      new ChannelHandler({
        name: "tabs.create",
        handler: promisify(tbs.create)
      }),

      new ChannelHandler({
        name: "tabs.get",
        handler: promisify(tbs.get)
      }),

      new ChannelHandler({
        name: "tabs.remove",
        handler: promisify(tbs.remove)
      }),

      new ChannelHandler({
        name: "tabs.update",
        handler: promisify(tbs.update)
      })
    ]
  : null;

export default handlers;
