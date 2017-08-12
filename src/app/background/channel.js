import { BackgroundChannel } from "chrome-ex";

const channel = new BackgroundChannel();
channel.connect();

export default channel;
