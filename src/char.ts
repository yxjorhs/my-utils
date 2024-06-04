/**
 * 字符工具包
 */
export interface ICharUtils {
  /** 所有小写字母字符 */
  LOWERCASE: string;
  /** 所有大写字母字符 */
  UPPERCASE: string;
  /** 所有数字字符 */
  NUMBER: string;
  /** 所有字符 */
  WORD: string;
}

class CharUtils implements ICharUtils {
  get LOWERCASE() {
    return Array.from({ length: 26 }, (_, i) => String.fromCharCode("a".charCodeAt(0) + i)).join("");
  }

  get UPPERCASE() {
    return this.LOWERCASE.toUpperCase();
  }

  get NUMBER() {
    return Array.from({ length: 10 }, (_, i) => i.toString()).join("");
  }

  get WORD() {
    return this.LOWERCASE + this.UPPERCASE + this.NUMBER;
  }
}

export const charUtils = new CharUtils();
