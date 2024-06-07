import assert from "assert";
import { randomNumber } from "./random-number";
import * as Validator from "./validator";

export interface IArrayUtils {
  /**
   * 按权重从数组随机返回元素
   * @param arr 数组
   * @param weight 元素回调，返回随机权重
   * @example
   * arrUtils.random([1,2,3], (item) => item)
   */
  random<T>(arr: T[], weight: (item: T, index: number) => number): T | null;
  /**
   * 数组转为JSON对象
   * @param arr 数组
   * @param key 对象键生成函数
   * @param val 对象值生成函数
   * @example
   * arrayToRecord([{ k: 'k', v: 'v'}], raw => raw.k, raw => raw.v)
   * // { k: 'v' }
   */
  toRecord<T, K extends string | number | symbol, V>(
    arr: T[],
    key: (item: T, index: number) => K,
    val: (item: T, index: number, pre: V | undefined) => V
  ): Record<K, V>;
  /**
   * 将数组转为map对象
   * @param arr 数组
   * @param key 键生成函数
   * @param val 值生成函数
   */
  toMap<T, K, V>(
    arr: T[],
    key: (item: T, index: number) => K,
    val: (item: T, index: number, pre: V | undefined) => V
  ): Map<K, V>;
}

class ArrayUtils implements IArrayUtils {
  random<T>(arr: T[], weight: (item: T, index: number) => number): T | null {
    /** weight sum, 元素权重总和 */
    let wsum: number;
    /** weight sum arr, 第1个元素到第n个元素的权重值总和 */
    let wsarr: number[];
    /** random, 随机数 */
    let rnum: number;

    wsarr = [];
    wsum = 0;

    arr.forEach((v, i) => {
      wsum += weight(v, i);
      assert(Validator.isuint(wsum), "wsum必须为非负整数");
      wsarr.push(wsum);
    });
    if (wsum === 0) return null;
    rnum = randomNumber(0, wsum, 0);

    for (let i = 0; i < wsarr.length; i++) {
      const v = wsarr[i];
      if (v >= rnum) return arr[i];
    }

    return null;
  }

  toRecord<T, K extends string | number | symbol, V>(
    arr: T[],
    key: (item: T, index: number) => K,
    val: (item: T, index: number, pre: V | undefined) => V
  ): Record<K, V> {
    const ret: any = {};
    arr.forEach((item, index) => {
      const k = key(item, index);
      ret[k] = val(item, index, ret[k]);
    });
    return ret;
  }

  toMap<T, K, V>(
    arr: T[],
    key: (item: T, index: number) => K,
    val: (item: T, index: number, pre: V | undefined) => V
  ): Map<K, V> {
    const mp: Map<K, V> = new Map();

    arr.forEach((item, index) => {
      const k = key(item, index);
      mp.set(k, val(item, index, mp.get(k)));
    });

    return mp;
  }
}

export const arrayUtils = new ArrayUtils();
