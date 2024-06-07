import crypto, { HexBase64Latin1Encoding } from "crypto";

/**
 * 生成随机字符串
 * @param len 随机字符串长度
 * @param encoding 随机字符串的编码
 */
export function randomString(len: number, encoding: HexBase64Latin1Encoding): string {
  let res = "";

  while (res.length < len) {
    res += crypto
      .createHash("md5")
      .update(Date.now() + Math.random().toString())
      .digest(encoding)
      .slice(0, len - res.length);
  }

  return res;
}
