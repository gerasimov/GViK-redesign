/* global AudioPlayer, getAudioPlayer */

import Events from './../../../core/events'

const ap = getAudioPlayer()

ap.on(null, AudioPlayer.EVENT_UPDATE, (...args) =>
  Events.dispatch('AUDIO_PLAYER_UPDATE', ...args)
)
ap.on(null, AudioPlayer.EVENT_PAUSE, (...args) =>
  Events.dispatch('AUDIO_PLAYER_PAUSE', ...args)
)
ap.on(null, AudioPlayer.EVENT_PROGRESS, (...args) =>
  Events.dispatch('AUDIO_PLAYER_PROGRESS', ...args)
)

Events.push()
