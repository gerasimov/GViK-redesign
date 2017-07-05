/* global chrome */

import ChannelHandler from './../../../core/channels/handler';
import {deferriffy} from './../../../core/deferred';

const dwns = chrome.downloads;

const handlers = dwns ? [

    new ChannelHandler({
        name   : 'downloads.search',
        handler: deferriffy(dwns.search),
    }),

] : null;

export  default  handlers;
