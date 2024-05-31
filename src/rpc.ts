/**
 * RPC
 * - 协议: http、https
 * - 通过配置多个socket实现客户端负载
 * - option.maxRetry配置最大失败重试次数, 默认1, 不重试
 */
import http from "http";
import https from "https";

export type SendHttpOption = https.RequestOptions & {
  /**
   * url参数
   * @example
   * {
   *   path: 'getPhone',
   *   query: { userUid: 'xxxxx', country: 'china' }
   * } // getPhone?userUid=xxxxx&country=china
   */
  query?: Record<string | number, string | number | boolean | undefined>;
  /** 传输内容 */
  body?: Buffer;
  /** 错误生成, 默认生成new Error(message), 可返回自定义错误类型 */
  errorGenerator?: (message: string) => Error;
  /** 失败重试次数，不传不重试，-1不断重试 */
  retryTimes?: number;
};

export type SendHttpResult = http.IncomingMessage & {
  data: Buffer;
};

export type ListenerParam = {
  option: SendHttpOption;
  err?: Error;
  result?: SendHttpResult;
};

export type Listener = (param: ListenerParam) => void;

export type Socket = {
  protocol: "http:" | "https:";
  host: string;
  port?: number;
};

export type Option = {
  /** 套接字 */
  socketArr: Socket[];
  /** 请求监听器 */
  listener?: Listener;
  /** 错误生成, 默认生成new Error(message), 可返回自定义错误类型 */
  errorGenerator?: (message: string) => Error;
};

export type Msg = string | Buffer;

export default class RPC {
  protected readonly socketStateArr: SocketState[];
  protected readonly listener?: Option["listener"];
  protected readonly genError: (message: string) => Error;

  constructor(option: Option) {
    this.socketStateArr = option.socketArr.map(SocketState.from);
    this.listener = option?.listener;
    this.genError = (message) => new Error(message);
    if (option.errorGenerator) this.genError = option.errorGenerator;
  }

  /**
   * 发送http请求
   * @param option 请求选项
   * @param listener 请求监听器
   */
  public static sendHttp(option: SendHttpOption, listener?: Listener): Promise<SendHttpResult> {
    let datas: any[] = [];

    let agent = option.agent;
    if (option.protocol === "https:") {
      agent = option.agent || new https.Agent();
    }

    let path = option.path || "";
    if (option.query) {
      path += "?";
      path += Object.entries(option.query)
        .filter(([_, val]) => val !== undefined)
        .map((raw) => raw[0] + "=" + raw[1])
        .join("&");
    }

    let genError = (message: string) => new Error(message);
    if (option.errorGenerator) genError = option.errorGenerator;

    return new Promise((resl, rej) => {
      const req = http.request(
        {
          ...option,
          agent,
          path,
        },
        (res) => {
          res.on("data", (data) => {
            datas.push(data);
          });
          res.on("end", () => {
            const result: SendHttpResult = Object.assign({}, res, { data: Buffer.concat(datas) });
            if (listener) listener({ option, result });

            if (result.statusCode !== 200) {
              const err = genError(
                `发送网络请求失败, statusCode: ${result.statusCode}, statusMessage: ${
                  result.statusMessage
                }, data: ${result.data.toString()}`
              );
              rej(err);
            }

            resl(result);
          });
        }
      );

      req.on("error", (err) => {
        if (listener) listener({ option, err });
        rej(err);
      });

      req.on("timeout", () => {
        if (listener) listener({ option, err: new Error("响应超时") });
        rej("响应超时");
      });

      if (option.body) req.write(option.body);

      req.end();
    });
  }

  /**
   * 发送http请求
   * @param option 配置 protocol, host, socket等信息会被配置的socket代替
   */
  public async sendHttp(option: SendHttpOption): Promise<SendHttpResult> {
    let result: SendHttpResult | undefined;
    let tryTimes = 0;
    let retryTimes = option.retryTimes || 0;

    while (retryTimes === -1 || tryTimes < 1 + retryTimes) {
      tryTimes++;
      const socket = this.getSocket();
      option.protocol = socket.protocol;
      option.host = socket.host;
      option.port = socket.port;

      await RPC.sendHttp(option, this.listener)
        .then((res) => {
          result = res;
          socket.record("success");
        })
        .catch((e) => {
          socket.record("fail");
          if (tryTimes === 1 + retryTimes) throw e;
        });

      if (result) break;
    }

    return result!;
  }

  /**
   * 根据socket状态挑选合适的socket
   */
  protected getSocket(): SocketState {
    this.socketStateArr.sort((a, b) => this.getSocketWeight(b) - this.getSocketWeight(a));
    return this.socketStateArr[0];
  }

  /**
   * 返回socket被使用的权重, 权重最高的会用于下次请求
   */
  protected getSocketWeight(socket: SocketState): number {
    let w1 = 1;
    // socket在10秒内发生过请求失败则降低其权重
    if (socket.lastFailAt && Date.now() - socket.lastFailAt.getTime() < 10000) w1 = 0;
    const w2 = Math.random();
    const w = w1 + w2;
    return w;
  }
}

class SocketState {
  public protocol: Socket["protocol"];
  public host: Socket["host"];
  public port?: Socket["port"];
  public requestNum: number = 0;
  public successNum: number = 0;
  public failNum: number = 0;
  public lastFailAt: Date | null = null;

  constructor(socket: Socket) {
    this.protocol = socket.protocol;
    this.host = socket.host;
    this.port = socket.port;
  }

  static from(socket: Socket) {
    return new SocketState(socket);
  }

  /**
   * 记录请求状态{requestState}, 刷新socket自身数据
   */
  record(requestState: "success" | "fail") {
    this.requestNum++;
    if (requestState === "success") this.successNum++;
    if (requestState === "fail") {
      this.failNum++;
      this.lastFailAt = new Date();
    }
  }
}
