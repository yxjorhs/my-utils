/** 递归剔除对象内的空值 */
export function omitNil<T>(data: T): T {
  if (typeof data !== "object") return data;

  for (const key in data) {
    if (data[key] === undefined || data[key] === null) {
      delete data[key];
      continue;
    }

    if (typeof data[key] !== "object") {
      continue;
    }

    omitNil(data[key]);
  }

  return data;
}
