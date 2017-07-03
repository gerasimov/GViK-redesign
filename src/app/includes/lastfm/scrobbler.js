// @flow

import Events from "./../../../core/events";

let isPaused = true;

const playerPauseWatcher = Events.create("audioPlayer.EVENT_PAUSE", data => {
  isPaused = true;
  //
});

const playerPlayWatcher = Events.create("audioPlayer.EVENT_PLAY", data => {
  isPaused = false;
});

const playerProgressWatcher = Events.create(
  "audioPlayer.EVENT_PROGRESS",
  data => {
    if (isPaused) {
      return null;
    }
  }
);

Events.push(playerProgressWatcher, playerPauseWatcher, playerPlayWatcher);
