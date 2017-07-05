/* global AudioPlayer, getAudioPlayer */

import Events from "./../../../core/events";

const ap = getAudioPlayer();

Object.keys(window.AudioPlayer)
    .filter(key => ~key.indexOf("EVENT_"))
    .forEach(eventName =>
        ap.on(null, AudioPlayer[eventName], (...args) =>
            Events.dispatch(`audioPlayer.${eventName}`, ...args)
        )
    );
