import './init';
import './handlers';
import Events from './../core/events';

import ContentChannel from './../core/channels/content';

const channel = new ContentChannel();
channel.connect();

window.gvik = {
  channel,
  Events,
};
