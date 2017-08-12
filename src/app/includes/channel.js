// @flow
import { IncludeChannel } from "chrome-ex";

const chan = new IncludeChannel();
chan.connect();

export default chan;

export const sendToContent = chan.sendToContent.bind(chan);
export const sendToBackground = chan.sendToBackground.bind(chan);

export const dispatchContentHandler = async (
  handler: string,
  ...args: Array<any>
): Promise<any> => {
  try {
    return await sendToContent({ args, handler });
  } catch (e) {}
};

export const dispatchBackgroundHandler = async (
  handler: string,
  ...args: Array<any>
): Promise<any> => {
  try {
    return await sendToBackground({ args, handler });
  } catch (e) {}
};
