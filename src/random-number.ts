import assert from "assert";
import { isuint } from "./validator";

/**
 * 生成随机数
 * @param min 最小值
 * @param max 最大值
 * @param decimal 保留多少个小数, 默认返回整数
 */
export function randomNumber(
  min: number,
  max: number,
  decimal?: number
): number {
  decimal = decimal || 0;

  assert(max > min, "expect max > min");
  assert(isuint(decimal), "expect decimal is unsigned intger");

  const num = min + Math.random() * (max - min);

  return Number(num.toFixed(decimal));
}
