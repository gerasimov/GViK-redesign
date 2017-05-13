import ChannelHandler from './../core/channels/handler';
import eventHandler from './../core/events/eventHandler';

ChannelHandler.addHandlers(
    eventHandler,
    new ChannelHandler({
      name: 'tabs.create',
      handler: (data) => new Promise((resolve, reject) => {
        if (!chrome.tabs) {
          return reject();
        }
        chrome.tabs.create(data.arg, (tab) => {
          resolve(tab);
        });
      }),
    }),

    new ChannelHandler({
      name: 'fetch',
      handler: (data) => fetch(...data.args).then((res) => res.text()),
    }),
);
