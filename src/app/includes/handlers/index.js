/* global Promise:true */

import { ChannelHandler } from "chrome-ex";
import eventHandler from "../../../core/events/eventHandler";

ChannelHandler.addHandlers(
  eventHandler,
  new ChannelHandler({
    name: "getVKID",
    handler: () => Promise.resolve(window.vk.id)
  })
);
