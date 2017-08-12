/* global chrome */

import { ChannelHandler } from "chrome-ex";
import { promisify } from "./../../../core/deferred";

const dwns = chrome.downloads;

const handlers = dwns
  ? [
      new ChannelHandler({
        name: "downloads.search",
        handler: promisify(dwns.search)
      })
    ]
  : null;

export default handlers;
