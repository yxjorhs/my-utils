/**
 * 字符串工具包
 */
import { charUtils } from "./char_utils";
import { numberUtils } from "./number_utils";

export interface IStringUtils {
  /**
   * 生成随机字符串
   * @param len 长度
   */
  random(len: number): string;
}

class StringUtils implements IStringUtils {
  random(len: number): string {
    let ret: string = "";
    while (ret.length < len) {
      ret += charUtils.WORD.charAt(numberUtils.random(0, charUtils.WORD.length - 1, 0));
    }
    return ret;
  }
}

export const stringUtils = new StringUtils();
