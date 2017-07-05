import fs from "fs";
import path from "path";
import { build } from "./paths";
import waterfall from "async/waterfall";

/**
 * @class Clean
 */
export default class Clean {
    apply = () =>
        waterfall(
            [
                next => next(null, fs.readdirSync(build)),
                (files, next) => {
                    next(
                        null,
                        files
                            .filter(file => !file.startsWith("."))
                            .map(file => path.join(build, file))
                    );
                },

                (files, next) => {
                    let coursor = 0;
                    let end = files.length;
                    const rmClb = () => ++coursor === end && next(null);

                    files.forEach(file => {
                        const stat = fs.statSync(file);
                        rmClb();
                        if (stat.isFile()) {
                            return fs.unlinkSync(file);
                        }

                        if (stat.isDirectory()) {
                            return fs.rmdirSync(file);
                        }
                    });
                }
            ],
            () => {
                console.log("Clean!");
            }
        );
}
