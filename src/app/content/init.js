// @flow
/* global window */

import { GVIK_FILE_NAME } from '../../../constants/'
import { requireScript } from './../../helpers'

const corePath = window.chrome.extension.getURL('core.js')
const gvikPath = window.chrome.extension.getURL(`${GVIK_FILE_NAME}.js`)

requireScript(corePath).then(() => requireScript(gvikPath))
