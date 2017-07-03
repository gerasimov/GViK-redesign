/* global Promise:true */
/* global vk:true */

import ChannelHandler from "../../../core/channels/handler";
import eventHandler from "../../../core/events/eventHandler";

ChannelHandler.addHandlers(
  eventHandler,
  new ChannelHandler({
    name: "getVKID",
    handler: () => Promise.resolve(vk.id)
  })
);
