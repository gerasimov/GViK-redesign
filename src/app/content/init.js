// @flow

import { GVIK_FILE_NAME } from "../../../constants/";
import { requireScript } from "./../../helpers";

const files = ["core.js", `${GVIK_FILE_NAME}.js`];

(async function() {
  for (let file of files) {
    await requireScript(window.chrome.extension.getURL(file));
  }
})();
