import './handlers';
import BackgroundChannel from './../core/channels/background';

const channel = new BackgroundChannel();
channel.connect();

window.gvik = {
  channel,
};
