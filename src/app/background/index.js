import "./handlers";
import "./events";
import channel from "./channel";

require("./../../../img/icons/icon16.png");

import { createMutation } from "./../../core/mutations";

window.gvik = {
  channel,
  createMutation
};
