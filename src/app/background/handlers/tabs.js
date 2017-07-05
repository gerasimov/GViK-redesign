/* global chrome */

import ChannelHandler from './../../../core/channels/handler';
import {deferriffy} from './../../../core/deferred';

const tbs = chrome.tabs;

const handlers = tbs
    ? [
        new ChannelHandler({
            name   : 'tabs.create',
            handler: deferriffy(tbs.create),
        }),

        new ChannelHandler({
            name   : 'tabs.get',
            handler: deferriffy(tbs.get),
        }),
    ]
    : null;

export default handlers;
