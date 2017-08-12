// @flow

import { createMutation, connect } from "./../../../core/mutations";
import { dispatchBackgroundHandler as background } from "./../channel";

const loadDownloadsListFailed = createMutation(
  "FAILED GET | downloads list",
  (state, error) => ({ error })
);

const loadDownloadsList = createMutation(
  "GET | downloads list",
  (_, downloads) => ({ downloads }),
  (apply, data) =>
    background("downloads.search", data || {})
      .then(apply)
      .catch(loadDownloadsListFailed)
);

export default connect(
  "chrome",
  {
    downloads: [],
    error: null
  },
  {
    loadDownloadsList,
    loadDownloadsListFailed
  }
);
