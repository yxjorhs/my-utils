import { request } from "./request";
import * as validator from "./validator";
import { randomString } from "./random-string";
import { randomNumber } from "./random-number";

interface IMyUtils {
  /** 发送网络请求 */
  request: typeof request;

  /** 校验器 */
  validator: typeof validator;

  /**
   * 生成随机字符串
   * @param len 随机字符串长度
   * @param encoding 随机字符串的编码
   */
  randomString: typeof randomString;

  /**
   * 生成随机数
   * @param min 最小值
   * @param max 最大值
   * @param decimal 保留多少个小数, 默认返回整数
   */
  randomNumber: typeof randomNumber;

  /**
   * 沉睡
   * @param ms 沉睡毫秒数
   */
  sleep(ms: number): Promise<void>;
}

class MyUtils implements IMyUtils {
  request = request;

  validator = validator;

  randomString = randomString;

  randomNumber = randomNumber;

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  }
}

export const myUtils = new MyUtils();
