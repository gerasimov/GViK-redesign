/* global chrome:true */

import channel from "./channel";

chrome.storage.onChanged.addListener(arg =>
  channel.sendToInclude({
    handler: "event",
    event: {
      name: "storage.onChanged",
      arg
    }
  })
);
