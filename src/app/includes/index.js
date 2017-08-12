import "./handlers";
import "./events";
import "./audio/watcher";

import VKAPI from "./vk/api";
import LastFMAPI from "./lastfm/api";

import * as actions from "./mutations";

import events from "./../../core/events";
import channel from "./channel";
const vk = new VKAPI();
const lastfm = new LastFMAPI();

export default (window.gvik = {
  vk,
  lastfm,
  channel,
  events,
  actions
});
