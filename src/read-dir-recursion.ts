import Path from "path";
import fs from "fs";

/**
 * 递归读取文件夹下的文件路径
 * @param path 文件夹路径
 * @param cb 文件路径回调
 */
export function readDirRecursion(path: string, cb: (path: string) => void) {
  if (fs.lstatSync(path).isFile()) {
    return cb(path);
  }

  for (const fileName of fs.readdirSync(path)) {
    readDirRecursion(Path.resolve(path + "/" + fileName), cb);
  }
}
