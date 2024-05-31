import { Transform, Writable } from "stream";
import https from "https";
import { stringUtils } from "./string_utils";
import crypto from "crypto";
import RPC from "./rpc";

interface IMyUtils {
  /** 字符串工具 */
  string: typeof stringUtils;

  request: typeof RPC.sendHttp;

  /**
   * 网络资源读取流
   * @param url 网络资源地址
   */
  netResourceReadStream(url: string): Writable;

  /** 生成随机32位字符串id */
  uid(): string;
}

class MyUtils implements IMyUtils {
  string = stringUtils;

  request = RPC.sendHttp;

  netResourceReadStream(url: string): Writable {
    let st = new Transform({
      transform(chunk, _encoding, callback) {
        this.push(chunk);
        callback();
      },
    });

    function endStreamWithErr(errmsg: string) {
      st.write(`errmsg: ${errmsg}`);
      st.end();
    }

    let req = https.get(new URL(url), (res) => res.pipe(st));

    req.on("error", (err) => {
      endStreamWithErr(err.message);
    });

    req.on("timeout", () => {
      endStreamWithErr("timeout");
    });

    return st;
  }

  uid() {
    const str = Date.now() + stringUtils.random(32);
    const uid = crypto.createHash("md5").update(str).digest("hex");
    return uid;
  }
}

export const myUtils = new MyUtils();
