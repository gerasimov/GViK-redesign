import IncludeChannel from './../core/channels/include';

const chan = new IncludeChannel();
chan.connect();

export default chan;
window.chan = chan;
export const sendToContent = chan.sendToContent;
export const sendToBackground = chan.sendToBackground;

export const dispatchContentHandler = (handler, args) => sendToContent(
    {...args, handler});

export const dispatchBackgroundHandler = (handler, args) => sendToBackground(
    {...args, handler});
