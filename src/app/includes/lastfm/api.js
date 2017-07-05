// @flow
import {
    sendToContent,
    dispatchBackgroundHandler as background,
    dispatchContentHandler as content,
} from '../channel';

import {
    LAST_FM_AUTH_URL,
    LAST_FM_API_KEY,
    LAST_FM_API_SECRET,
} from './../../../../constants';

import md5 from 'md5';
import queryString from 'query-string';

export type ScrobbleData = {
    artist: string, // [i] (Required) : The artist name.
    track: string, // [i] (Required) : The track name.
    timestamp: ?string, // [i] (Required) : The time the track started playing,
                        // in UNIX timestamp format (integer number of seconds
                        // since 00:00:00, January 1st 1970 UTC). This must be
                        // in the UTC time zone.
    album: ?string, // [i] (Optional) : The album name.
    context: ?string, // [i] (Optional) : Sub-client version (not public, only
                      // enabled for certain API keys)
    streamId: ?string, // [i] (Optional) : The stream id for this track
                       // received from the radio.getPlaylist service, if
                       // scrobbling Last.fm radio
    chosenByUser: ?string, // [i] (Optional) : Set to 1 if the user chose this
                           // song, or 0 if the song was chosen by someone else
                           // (such as a radio station or recommendation
                           // service). Assumes 1 if not specified
    trackNumber: ?string, // [i] (Optional) : The track number of the track on
                          // the album.
    mbid: ?string, // [i] (Optional) : The MusicBrainz Track ID.
    albumArtist: ?string, // [i] (Optional) : The album artist - if this
                          // differs from the track artist.
    duration: ?string | ?number // [i] (Optional) : The length of the track in
                                // seconds.
};

export type UpdateData = {
    artist: string, // (Required) : The artist name.
    track: string, // (Required) : The track name.
    album: ?string, // (Optional) : The album name.
    trackNumber: ?string, // (Optional) : The track number of the track on the
                          // album.
    context: ?string, // (Optional) : Sub-client version, (not public, only
                      // enabled for certain API keys)
    mbid: ?string, // (Optional) : The MusicBrainz Track ID.
    duration: ?string | ?number, // (Optional) : The length of the track in
                                 // seconds.
    albumArtist: ?string // (Optional) : The album artist - if this differs
                         // from the track artist.
};

/**
 * @class LastFMAPI
 */
export default class LastFMAPI {
    static getSessionKey = () => `lastfm${window.vk.id}`;

    /**
     * @return {Promise}
     */
    async auth() {
        const path = await content(
          'getPath',
          require('./../../pages/lastfm/login.html'),
        );
        let token;

        try {
            const tokenRes = await background(
              'oauth',
              `${LAST_FM_AUTH_URL}?api_key=${LAST_FM_API_KEY}&cb=${path}`,
            );
            token = (tokenRes || {}).token;
        } catch (e) {}

        if (!token) {
            return null;
        }

        let session;
        try {
            const sessionRes = await this.call(
              'auth.getSession',
              {token},
              true,
            );
            session = (sessionRes || {}).session;
        } catch (e) {}

        if (!session) {
            return null;
        }
        await content('sync.set', {[LastFMAPI.getSessionKey()]: session});

        return session;
    }

    /**
     * @param {object} params
     * @return {Promise}
     */
    async send(params: { [string]: any }) {
        return sendToContent({
            handler: 'fetch',
            type   : 'json',
            args   : [
                'https://ws.audioscrobbler.com/2.0/',
                {
                    body       : queryString.stringify(params),
                    method     : 'POST',
                    credentials: 'include',
                    headers    : {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            ],
        });
    }

    /**
     * @method getSignature
     * @param {object} params
     * @return {string}
     */
    getSignature(params: { [string]: any }): string {
        return md5(
          Object.keys(params).map(key => key + params[key]).sort().join('') +
          LAST_FM_API_SECRET,
        );
    }

    /**
     * @method getSession
     * @param {boolean} isAuthMethod
     * @param {string} userKey
     * @return {object}
     */
    async getSession(
      isAuthMethod: boolean = false,
      userKey: string = LastFMAPI.getSessionKey()) {
        let session = null;
        try {
            const storeData = await content('sync.get', userKey);
            session = storeData[userKey];
        } catch (e) {}

        if (session) {
            return session;
        }

        if (!isAuthMethod) {
            return await this.auth();
        }

        return null;
    }

    /**
     * @method call
     * @param {string} method
     * @param {object} data
     * @param {boolean} isAuthMethod
     * @return {object|null}
     */
    async call(
      method: string,
      data: { [string]: any },
      isAuthMethod: boolean = false): Promise<any> {
        data = {
            ...data,
            method,
            lang   : 'ru',
            api_key: LAST_FM_API_KEY,
        };
        const session = await this.getSession(isAuthMethod);

        if (session) {
            data.sk = session.key;
        }

        try {
            return await this.send({
                ...data,
                api_sig: this.getSignature(data),
                format : 'json',
            });
        } catch (e) {}
    }

    methods = {
        auth: {
            /**
             * @return {Promise}
             */
            getSession: async ({token}: { [string]: any }) =>
              await this.call('auth.getSession', {token}, true),
        },

        track: {
            /**
             * @param {UpdateData} data
             * @return {Promise}
             */
            updateNowPlaying: async (data: UpdateData): Promise<any> =>
              this.call('track.updateNowPlaying', data),

            /**
             * @param {UpdateData} data
             * @return {Promise}
             */
            scrobble: async (data: UpdateData): Promise<any> =>
              this.call('track.scrobble', data),

            getInfo      : async (data: { [string]: any }): Promise<any> =>
              this.call('track.getInfo', data),
            /**
             *  @param {Array} tracks
             */
            scrobbleBatch: async function(
              tracks: Array<ScrobbleData>): Promise<any> {},
        },
    };
}
