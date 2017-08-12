import Manifest from "chrome-manifest";
import { src, build } from "./../paths";
import path from "path";
import fs from "fs";

const mainifestSrc = path.join(src, "manifest.json");
const mainifestDest = path.join(build, "manifest.json");

export const manifest = new Manifest(mainifestSrc);

/**
 * @class ManifestPlugin
 */
export default class ManifestPlugin {
  patchVersion = () => {};
  /**
   * @param {any} compiler
   */
  apply = compiler => {
    compiler.plugin("done", s => {
      fs.writeFile(mainifestDest, manifest.toJSON(), () => {});
    });
  };
}
