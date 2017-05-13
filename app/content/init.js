import {GVIK_FILE_NAME} from '../../constants/';

let script = document.createElement('script');
script.src = chrome.extension.getURL(`core.js`);
document.documentElement.appendChild(script);

script.onload = () => {
  script = document.createElement('script');
  script.src = chrome.extension.getURL(`${GVIK_FILE_NAME}.js`);
  document.documentElement.appendChild(script);
};
