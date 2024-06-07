import { request } from "./request";
import * as validator from "./validator";
import { randomString } from "./random-string";
import { randomNumber } from "./random-number";
import { arrayUtils } from "./array";
import { readDirRecursion } from "./read-dir-recursion";
import { interval } from "./interval";
import { replaceNil } from "./replace-nil";
import { ipv4 } from "./ipv4";
import { omitNil } from "./omit-nil";
import { replaceKey } from "./replace-key";

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

  /** 数组工具 */
  array: typeof arrayUtils;

  /**
   * 递归读取文件夹下的文件路径
   * @param path 文件夹路径
   * @param cb 文件路径回调
   */
  readDirRecursion: typeof readDirRecursion;

  /**
   * 循环，执行完毕后等待一段时间再次执行
   * @param fn 执行函数
   * @param ms 循环等待间隔
   *
   * @example
   * interval(() => console.log('hello'), 1000)
   * */
  interval: typeof interval;

  /**
   * {val1}为空值时，使用{val2}代替
   * @return val
   */
  replaceNil: typeof replaceNil;

  /** 返回ip地址 */
  ipv4: typeof ipv4;

  /** 递归剔除对象内的空值 */
  omitNil: typeof omitNil;

  /**
   * 替换对象的key
   * @param record 替换目标
   * @param replaceFn 替换函数
   * @example
   * let a = { a: 1}
   * let b= replaceRecordKey(a, (k) => k.toUpperCase()); // { A: 1 }
   */
  replaceKey: typeof replaceKey;
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

  array = arrayUtils;

  readDirRecursion = readDirRecursion;

  interval = interval;

  replaceNil = replaceNil;

  ipv4 = ipv4;

  omitNil = omitNil;

  replaceKey = replaceKey;
}

export const myUtils = new MyUtils();
