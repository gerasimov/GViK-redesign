// @flow

import Events, { Event as GViKEvent } from "../../../core/events/index";
// import {lastfm as actions} from '../mutations/index';
import LastFMAPI from "../lastfm/api";

const ap = window.getAudioPlayer();
const api = new LastFMAPI();

/**
 * @class AudioWatcher
 */
export class AudioWatcher {
  isPaused = true;
  track: Track;
  artist: string;
  track: string;
  scrobbled: boolean;

  trackId: ?number = null;
  playerPauseWatcher: GViKEvent;
  playerPlayWatcher: GViKEvent;
  playerProgressWatcher: GViKEvent;

  /**
     *
     */
  constructor() {
    this.playerPauseWatcher = Events.create("audioPlayer.EVENT_PAUSE", () => {
      this.isPaused = true;
    });

    this.playerPlayWatcher = Events.create("audioPlayer.EVENT_PLAY", () => {
      this.isPaused = false;
      const [trackId] = ap._currentAudio;

      if (this.trackId !== trackId) {
        this.onNewTrack();
      }
    });

    this.playerProgressWatcher = Events.create(
      "audioPlayer.EVENT_PROGRESS",
      this.onProgress.bind(this)
    );

    this.init();
  }

  /**
     *
     */
  init() {
    Events.push(
      this.playerProgressWatcher,
      this.playerPauseWatcher,
      this.playerPlayWatcher
    );
  }

  /**
     *
     */
  destroy() {
    Events.remove(
      this.playerProgressWatcher,
      this.playerPauseWatcher,
      this.playerPlayWatcher
    );
  }

  /**
     * @method onProgress
     * @return {any}
     */
  async onProgress() {
    if (this.isPaused) {
      return null;
    }

    const percent = parseFloat(ap.getCurrentProgress().toFixed(2)) * 100;

    if (percent < 50 || this.scrobbled) {
      return;
    }

    await api.methods.track
      .scrobble({
        artist: this.artist,
        track: this.track
      })
      .then(() => (this.scrobbled = true));
  }

  /**
     * @method onNewTrack
     * @return {Promise}
     */
  async onNewTrack() {
    const [id, , , track, artist, duration] = ap._currentAudio;

    Object.assign(this, {
      id,
      artist,
      track,
      duration,
      scrobbled: false
    });

    try {
      const {
        name: track,
        artist: { name: artist }
      } = await api.methods.track.getInfo({
        artist,
        track,
        autocorrect: 1
      });

      track &&
        Object.assign(this, {
          track,
          artist
        });
    } catch (e) {}

    return await api.methods.track.updateNowPlaying({
      artist: this.artist,
      track: this.track
    });
  }
}

export default new AudioWatcher();
