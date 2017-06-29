/* global fetch */

import ChannelHandler from './../../../core/channels/handler'
import eventHandler from './../../../core/events/eventHandler'
import oauth from './../oauth'
import tabs from './tabs'

ChannelHandler.addHandlers(
  eventHandler,
  ...tabs,
  new ChannelHandler({
    name: 'oauth',
    handler: ({ args, tab }) => oauth(...args, tab.id)
  }),
  new ChannelHandler({
    name: 'fetch',
    handler: ({ args }) => fetch(...args).then(res => res.text())
  })
)
