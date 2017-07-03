// @flow
import { dispatchBackgroundHandler, dispatchContentHandler } from "../channel";
import md5 from "md5";
import lastfLoginPage from "./../../pages/lastfm/login.html";

type ScrobbleData = {
  artist: string, // [i] (Required) : The artist name.
  track: string, // [i] (Required) : The track name.
  timestamp: string, // [i] (Required) : The time the track started playing, in UNIX timestamp format (integer number of seconds since 00:00:00, January 1st 1970 UTC). This must be in the UTC time zone.
  album: string, // [i] (Optional) : The album name.
  context: string, // [i] (Optional) : Sub-client version (not public, only enabled for certain API keys)
  streamId: string, // [i] (Optional) : The stream id for this track received from the radio.getPlaylist service, if scrobbling Last.fm radio
  chosenByUser: string, // [i] (Optional) : Set to 1 if the user chose this song, or 0 if the song was chosen by someone else (such as a radio station or recommendation service). Assumes 1 if not specified
  trackNumber: string, // [i] (Optional) : The track number of the track on the album.
  mbid: string, // [i] (Optional) : The MusicBrainz Track ID.
  albumArtist: string, // [i] (Optional) : The album artist - if this differs from the track artist.
  duration: string // [i] (Optional) : The length of the track in seconds.
};

type UpdateData = {
  artist: string, // (Required) : The artist name.
  track: string, // (Required) : The track name.
  album: string, // (Optional) : The album name.
  trackNumber: string, // (Optional) : The track number of the track on the album.
  context: string, // (Optional) : Sub-client version, (not public, only enabled for certain API keys)
  mbid: string, // (Optional) : The MusicBrainz Track ID.
  duration: string, // (Optional) : The length of the track in seconds.
  albumArtist: string // (Optional) : The album artist - if this differs from the track artist.
};

/**
 * @class LastFMAPI
 */
export default class LastFMAPI {
  static key = "fe8b52c2ba5ef2c9e7c18a8064fbd92d";
  static secret = "e28079729f31ca7e1cab7ba3dee55b71";
  static authPath = "http://www.last.fm/api/auth/";
  static getSessionKey = () => `lastfm${window.vk.id}`;
  /**
   * @return {Promise}
   */
  auth = async () => {
    const path = await dispatchContentHandler("getPath", {
      path: lastfLoginPage
    });

    let token;
    let session;

    try {
      token = (await dispatchBackgroundHandler("oauth", {
        args: [`${LastFMAPI.authPath}?api_key=${LastFMAPI.key}&cb=${path}`]
      })).token;
    } catch (e) {
      return null;
    }

    if (!token) {
      return null;
    }

    try {
      session = (await this.methods.auth.getSession(token)).session;
    } catch (e) {
      return null;
    }

    if (!session) {
      return null;
    }
    await dispatchContentHandler("sync.set", {
      arg: { [LastFMAPI.getSessionKey()]: session }
    });

    return session;
  };

  send = async (params: { [string]: any }) =>
    window
      .fetch("https://ws.audioscrobbler.com/2.0/", {
        body: Object.keys(params).map(k => k + "=" + params[k]).join("&"),
        method: "POST",
        cache: "default"
      })
      .then(r => r.json());

  getSignature(params: { [string]: any }): string {
    return md5(
      Object.keys(params).map(key => key + params[key]).sort().join("") +
        LastFMAPI.secret
    );
  }
  async getSession(
    isAuthMethod: boolean = false,
    userKey: string = LastFMAPI.getSessionKey()
  ) {
    try {
      const storeData = await dispatchContentHandler("sync.get", {
        arg: userKey
      });
      const session = storeData[userKey];

      if (session) {
        return session;
      }

      if (!isAuthMethod) {
        return await this.auth();
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  async call(
    method: string,
    data: { [string]: any },
    isPost: boolean = true,
    isAuthMethod: boolean = false
  ): Promise<any> {
    const extendedData: { [string]: any } = {
      ...data,
      method,
      lang: "ru",
      api_key: LastFMAPI.key
    };
    const session = await this.getSession(isAuthMethod);
    if (session) {
      extendedData.sk = session.key;
    }
    extendedData.api_sig = this.getSignature(extendedData);
    extendedData.format = "json";
    try {
      return await this.send(extendedData);
    } catch (e) {
      return null;
    }
  }
  methods = {
    auth: {
      getSession: async (token: string): Promise<any> => {
        try {
          return await this.call("auth.getSession", { token }, false, true);
        } catch (e) {
          return null;
        }
      }
    },

    track: {
      updateNowPlaying: async (data: UpdateData): Promise<any> =>
        this.call("track.updateNowPlaying", data),
      scrobble: async (data: UpdateData): Promise<any> =>
        this.call("track.scrobble", data),
      scrobbleBatch: async (tracks: Array<ScrobbleData>): Promise<any> => {}
    }
  };
}
