import VKAPI from './vk';
import LastFMAPI from './lastfm';

const vk = new VKAPI();
const lastfm = new LastFMAPI();
export default window.gvik = {
  vk,
  lastfm,
};

