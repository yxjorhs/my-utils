import os from "os";

/** 返回ip地址 */
export function ipv4(): string | null {
  const itfs = os.networkInterfaces();
  const match =
    itfs["en0"] || // mac
    itfs["eth0"]; // Linux
  if (!match) return null;

  const find = match.find((item) => item.family === "IPv4");
  if (!find) return null;

  return find.address;
}
