import lodash from "lodash";
import assert from "assert";
import http from "http";
import https from "https";
import { Readable } from "stream";

/** 发送网络请求 */
export function request(
  options: RequestOptions | string | URL
): Promise<Requester> {
  let protocol: string;
  let body: Buffer | Readable | undefined;

  if (options instanceof URL) {
    protocol = options.protocol;
  } else if (typeof options === "string") {
    protocol = new URL(options).protocol;
  } else {
    protocol = options.protocol || "https";
    if (options.query) {
      let u = new URL(`${protocol}//${options.host}`);

      if (options.port !== undefined && options.port !== null)
        u.port = options.port?.toString();

      if (options.path) u.pathname = options.path;

      Object.entries(options.query)
        .filter(([_, v]) => !lodash.isNil(v))
        .map(([name, value]) => u.searchParams.append(name, String(value)));

      options.path = u.pathname + u.search;

      delete options.query;
    }

    body = options.body;
  }

  assert(protocol === "https:" || "http:", "仅支持http、https请求");

  return new Promise((resolve, reject) => {
    let req = (protocol === "http:" ? http : https).request(options, (res) => {
      resolve(new Requester(res));
    });

    req.on("error", (err) => reject(err));

    req.on("timeout", () => reject("timeout"));

    if (body instanceof Buffer) {
      req.write(body);
    } else if (body instanceof Readable) {
      body.pipe(req);
    }

    req.end();
  });
}

export type RequestOptions = http.RequestOptions & {
  /** url参数 */
  query?: Record<string, string | number>;
  /** body */
  body?: Buffer | Readable;
};

interface IRequester {
  /** 获取响应头 */
  headers(): http.IncomingHttpHeaders;

  /** 以读取流格式获取响应数据 */
  read(): Readable;

  /** 等待返回数据传输完毕 */
  wait(): Promise<Buffer>;

  /** 等待返回数据传输完毕 */
  wait(format: "buffer"): Promise<Buffer>;

  /** 等待返回数据传输完毕, 并格式化为json */
  wait(format: "json"): Promise<Record<string, any>>;
}

class Requester implements IRequester {
  /** 响应是否结束 */
  protected isEnd = false;

  constructor(protected readonly incomingMessage: http.IncomingMessage) {
    incomingMessage.on("end", () => {
      this.isEnd = true;
    });
  }

  headers(): http.IncomingHttpHeaders {
    return this.incomingMessage.headers;
  }

  read(): Readable {
    assert(!this.isEnd, "响应结束");

    return this.incomingMessage;
  }

  wait(): Promise<Buffer>;
  wait(format: "buffer"): Promise<Buffer>;
  wait(format: "json"): Promise<Record<string, any>>;
  wait(format?: any): Promise<Buffer> | Promise<Record<string, any>> {
    assert(!this.isEnd, "响应结束");

    return new Promise((resolve) => {
      let buf = Buffer.from("");

      this.incomingMessage.on("data", (data) => (buf += data));

      this.incomingMessage.on("end", () => {
        if (format === "json") {
          let res: any;
          try {
            res = JSON.parse(buf.toString());
          } catch (e: any) {
            throw new Error(
              `解析json失败, message: ${e.message}, content: ${buf.toString()}`
            );
          }
          return resolve(res);
        }

        return resolve(buf);
      });
    });
  }

  buffer(): Promise<Buffer> {
    assert(!this.isEnd, "响应结束");

    return new Promise((resolve) => {
      let buf: Buffer = Buffer.from("");

      this.incomingMessage.on(
        "data",
        (data) => (buf = Buffer.concat([buf, data]))
      );

      this.incomingMessage.on("end", () => resolve(Buffer.from(buf)));
    });
  }
}
