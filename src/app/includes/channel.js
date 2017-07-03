// @flow
import IncludeChannel from "./../../core/channels/include";

const chan = new IncludeChannel();
chan.connect();

export default chan;

export const sendToContent = chan.sendToContent;
export const sendToBackground = chan.sendToBackground;

export const dispatchContentHandler = async (
  handler: string,
  args: Object
): Promise<any> => {
  try {
    return await sendToContent({ ...args, handler });
  } catch (e) {
    return e;
  }
};

export const dispatchBackgroundHandler = async (
  handler: string,
  args: Object
): Promise<any> => {
  try {
    return await sendToBackground({ ...args, handler });
  } catch (e) {
    return e;
  }
};
