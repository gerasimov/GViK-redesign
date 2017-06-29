import Manifest from 'chrome-manifest'
import { src, build } from './paths'
import path from 'path'
import fs from 'fs'

const mainifestSrc = path.join(src, 'manifest.json')
const mainifestDest = path.join(build, 'manifest.json')

export const manifest = new Manifest(mainifestSrc)

export default class ManifestPlugin {
  patchVersion = () => {};
  apply = () => fs.writeFile(mainifestDest, manifest.toJSON(), () => {});
}
