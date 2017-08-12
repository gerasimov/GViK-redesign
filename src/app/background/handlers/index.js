/* global fetch */

import { ChannelHandler as CH } from "chrome-ex";
import eventHandler from "./../../../core/events/eventHandler";
import oauth from "./../oauth";
import tabs from "./tabs";
import downloads from "./downloads";

CH.addHandlers(
  eventHandler,
  ...tabs,
  ...downloads,
  {
    name: "oauth",
    handler: ({ args, tab }) => oauth(...args, tab.id)
  },

  {
    name: 'fetch',
    handler: () => Promise.resolve(3)
  }
  // new CH({
  //   name: "fetch",
  //   handler: ({ args }) => fetch(...args).then(res => res.text())
  // })
);
