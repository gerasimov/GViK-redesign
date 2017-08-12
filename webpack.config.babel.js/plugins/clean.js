import fs from "fs";
import path from "path";
import { build } from "./../paths";

/**
 * @class Clean
 */
export default class Clean {
  apply = () =>
    fs
      .readdirSync(build)
      .filter(file => !file.startsWith("."))
      .map(file => path.join(build, file))
      .forEach(file => {
        const stat = fs.statSync(file);

        if (stat.isFile()) {
          return fs.unlinkSync(file);
        }

        if (stat.isDirectory()) {
          return fs.rmdirSync(file);
        }
      });
}
