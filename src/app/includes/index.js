import "./handlers";
import "./events";
import "./lastfm/scrobbler";
// import "./ui/Sidebar";
import { lastfm as lastfmActions, vk as vkActions } from "./mutations/";
import VKAPI from "./vk/api";
import LastFMAPI from "./lastfm/api";
import store from "./../../store";

import events from "./../../core/events";
import channel from "./channel";
const vk = new VKAPI();
const lastfm = new LastFMAPI();

export default (window.gvik = {
  vk,
  lastfm,
  channel,
  events,
  store,
  lastfmActions,
  vkActions
});
