/** 是否是整数 */
export function isInt(v: any): v is number {
  return typeof v === "number" && v % 1 == 0;
}

/**
 * 是否是正整数
 * @param v value
 * @return boolean
 */
export function isPosInt(v: any): v is number {
  return isInt(v) && v > 0;
}

/** 是否是无符号整数 */
export function isuint(v: any): v is number {
  return isInt(v) && v >= 0;
}

/**
 * 是否是邮箱地址
 * @param v value
 * @return boolean
 */
export function isEmail(v: any): v is string {
  return /^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/.test(
    v
  );
}

/**
 * 是否是手机号码
 * @param v value
 * @return boolean
 */
export function isPhone(v: any): v is string {
  return /^[1][3-9][0-9]{9}$/.test(v);
}

/**
 * 是否是身份证
 * @param v value
 * @return boolean
 */
export function isIdCardNum(v: any): v is string {
  return /^(\d{18}|\d{15}|\d{17}x)$/.test(v);
}

export type IsStringOption = {
  len?: number;
  minLen?: number;
  maxLen?: number;
};

/**
 * 是否是字符串
 */
export function isString(v: any, option?: IsStringOption): v is string {
  let res = true;

  res = res && typeof v === "string";

  if (!option) return res;

  if (option.len !== undefined) {
    res = res && v.length === option.len;
  }

  if (option.maxLen !== undefined) {
    res = res && v.length <= option.maxLen;
  }

  if (option.minLen !== undefined) {
    res = res && v.length >= option.minLen;
  }

  return res;
}

/** 是否是时间字符串(格式: YYYY/MM/DD HH:mm:ss) */
export function isDateString(v: any): boolean {
  return (
    !isNaN(new Date(v).getTime()) &&
    /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}(.\d{3})?$/.test(v)
  );
}
