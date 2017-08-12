import "./init";
import "./handlers";
import "./events";
import channel from "./channel";

import Events from "./../../core/events";
import { createMutation } from "./../../core/mutations";

window.gvik = {
  channel,
  Events,
  createMutation
};
