import ChannelHandler from './../channels/handler';
import Events from './index';

const eventHandler = new ChannelHandler({
  name: 'event',
  handler: (data) => {
    if (!data.event) {
      return Promise.reject();
    }
    return Events.dispatch(data.event.name, data.event.arg);
  },
});

export default eventHandler;