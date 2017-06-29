/* global window:true */

import VKAPI from './vk'
import LastFMAPI from './lastfm'
import events from './../../../core/events'
import channel from '../channel'
const vk = new VKAPI()
const lastfm = new LastFMAPI()
export default (window.gvik = {
  vk,
  lastfm,
  channel,
  events
})
