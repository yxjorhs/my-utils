import { stringUtils } from "./string";
import crypto from "crypto";
import { request } from "./request";
import * as validator from "./validator";

interface IMyUtils {
  /** 生成随机32位字符串id */
  uid(): string;

  /** 发送网络请求 */
  request: typeof request;

  /** 校验器 */
  validator: typeof validator;
}

class MyUtils implements IMyUtils {
  uid() {
    const str = Date.now() + stringUtils.random(32);
    const uid = crypto.createHash("md5").update(str).digest("hex");
    return uid;
  }

  request = request;

  validator = validator;
}

export const myUtils = new MyUtils();
