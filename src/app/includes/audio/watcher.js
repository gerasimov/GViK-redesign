// @flow

import Events, {Event as GViKEvent} from '../../../core/events/index';
import {lastfm as actions} from '../mutations/index';
import LastFMAPI from '../lastfm/api';
import type {ScrobbleData, UpdateData} from '../lastfm/api';

const ap = window.getAudioPlayer();
const api = new LastFMAPI();

/**
 * @class AudioWatcher
 */
export class AudioWatcher {
    isPaused = true;
    track: ?Object = null;
    trackId: ?number = null;
    playerPauseWatcher: GViKEvent;
    playerPlayWatcher: GViKEvent;
    playerProgressWatcher: GViKEvent;

    /**
     *
     */
    constructor() {
        this.playerPauseWatcher = Events.create(
          'audioPlayer.EVENT_PAUSE',
          this.onPause.bind(this),
        );

        this.playerPlayWatcher = Events.create(
          'audioPlayer.EVENT_PLAY',
          this.onPlay.bind(this),
        );

        this.playerProgressWatcher = Events.create(
          'audioPlayer.EVENT_PROGRESS',
          this.onProgress.bind(this),
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
          this.playerPlayWatcher,
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
    onProgress() {
        if (this.isPaused) {
            return null;
        }
    }

    /**
     *
     */
    onNewTrack() {
        const [trackId, , , artist, track, duration] = ap._currentAudio;
        this.trackId = trackId;
        this.track = {
            artist,
            track,
            duration,
        };

        actions.loadTrackInfo(this.track);
    }

    /**
     *
     */
    onPlay() {
        this.isPaused = false;
        const [trackId] = ap._currentAudio;

        if (this.trackId !== trackId) {
            this.onNewTrack();
        }

        this.onUpdateNowPlaying();
    }

    /**
     *
     */
    onPause() {
        this.isPaused = true;
    }

    onUpdateNowPlaying() {
        const data: UpdateData = {
            ...this.track
        };

        return api.methods.track.updateNowPlaying(data);
    }

    /**
     *
     * @return {*|Promise.<any>}
     */
    onScrobble() {
        const data: ScrobbleData = {
            ...this.track
        };

        return api.methods.track.scrobble(data);
    }
}

export default new AudioWatcher();
