/**
 * 数字工具包
 */
import assert from "assert";
import * as Validator from "./validator";

export interface INumberUtils {
  /**
   * 生成随机数
   * @param min 最小值
   * @param max 最大值
   * @param decimal 保留多少个小数
   */
  random(min: number, max: number, decimal?: number): number;
}

class NumberUtils implements INumberUtils {
  random(min: number, max: number, decimal?: number | undefined): number {
    decimal = decimal || 0;

    assert(max > min);
    assert(Validator.isuint(decimal));

    const num = min + Math.random() * (max - min);
    return Number(num.toFixed(decimal));
  }
}

export const numberUtils = new NumberUtils();
