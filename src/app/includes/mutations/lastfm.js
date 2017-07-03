// @flow

import { createMutation, connect } from "./../../../core/mutations";
import LastFMAPI from "./../lastfm/api";
const lastfm = new LastFMAPI();

export const setSessionError = createMutation(
  "SET_LAST_FM_SESSION_ERROR",
  (_, { sessionError }) => ({ sessionError })
);

export const setSessionSuccess = createMutation(
  "SET_LAST_FM_SESSION_SUCCESS",
  (_, session) => ({ session })
);

export const setSession = createMutation("SET_LAST_FM_SESSION", null, () =>
  lastfm.getSession().then(setSessionSuccess).catch(setSessionError)
);

export const setTrackInfo = createMutation(
  "SET_LAST_FM_TRACK_INFO",
  (_, { track }) => ({ track })
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
    setSessionSuccess,
    setTrackInfo
  }
);
