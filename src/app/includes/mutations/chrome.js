// @flow

import {createMutation, connect} from './../../../core/mutations';
import {dispatchBackgroundHandler} from './../channel';

const loadDownloadsList = createMutation('CHROME_LOAD_DOWNLOADS_LIST',
    (store, downloads) => ({downloads}),
    async (apply, data) =>
        await dispatchBackgroundHandler('downloads.search', data || {}).then(apply),
);

export default connect(
    'chrome',
    {
        downloads: [],
    },
    {
        loadDownloadsList,
    },
);

