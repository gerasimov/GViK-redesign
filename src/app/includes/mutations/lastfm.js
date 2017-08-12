// @flow

import { createMutation, connect } from "./../../../core/mutations";
import LastFMAPI from "./../lastfm/api";

const api = new LastFMAPI();

const setSessionError = createMutation(
  "SET_LAST_FM_SESSION_ERROR",
  (_, { sessionError }) => ({ sessionError })
);

export const setSession = createMutation(
  "SET_LAST_FM_SESSION",
  (_, session) => ({ session }),
  mutation => api.getSession().then(mutation).catch(setSessionError)
);

const setTrackInfoFail = createMutation(
  "SET_LAST_FM_TRACK_INFO_FAIL",
  (_, error) => ({
    track: error
  })
);

export const loadTrackInfo = createMutation(
  "LOAD_LAST_FM_TRACK_INFO",
  (_, { track }) => ({ track }),
  async (mutation, data) =>
    await api.methods.track.getInfo(data).then(mutation).catch(setTrackInfoFail)
);

export default connect(
  "lastfm",
  {
    sessionError: null,
    session: null,
    track: null
  },
  {
    setSession,
    setSessionError,
    loadTrackInfo,
    setTrackInfoFail
  }
);
