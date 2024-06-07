/**
 * 循环，执行完毕后等待一段时间再次执行
 * @param fn 执行函数
 * @param ms 循环等待间隔
 *
 * @example
 * interval(() => console.log('hello'), 1000)
 * */
export async function interval(fn: () => any, ms: number, timeoutCb?: (timeout: NodeJS.Timeout) => void) {
  const res = fn();
  if (res instanceof Promise) await res;

  const timeout = setTimeout(() => {
    interval(fn, ms, timeoutCb);
  }, ms);

  timeoutCb && timeoutCb(timeout);
}
