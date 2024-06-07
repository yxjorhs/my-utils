/**
 * {val1}为空值时，使用{val2}代替
 * @return val
 */
export function replaceNil<T>(val: T | undefined | null, val2: T): T {
  return val === undefined || val === null ? val2 : val;
}
