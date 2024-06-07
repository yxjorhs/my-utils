import { RecordKey } from "./common";

/**
 * 替换对象的key
 * @param record 替换目标
 * @param replaceFn 替换函数
 * @example
 * let a = { a: 1}
 * let b= replaceRecordKey(a, (k) => k.toUpperCase()); // { A: 1 }
 */
export function replaceKey<K extends RecordKey, K2 extends RecordKey, V>(
  record: Record<K, V>,
  replaceFn: (k: K) => K2
): Record<K2, V> {
  let res: Record<K2, V> = {} as any;
  for (const k in record) {
    res[replaceFn(k)] = record[k];
  }
  return res;
}
