import Client, { Cluster } from "ioredis";
import util from "util";

class RedisDAO {
  get DB(): number {
    return parseInt(process.env.REDIS_DB);
  }
  readonly UserSession = "user_sessions";
  readonly AdminSession = "admin_sessions";

  client: Client.Cluster | Client.Redis;
  subscriber: Client.Cluster | Client.Redis;
  publisher: Client.Cluster | Client.Redis;
  options: Client.ClusterOptions | Client.RedisOptions;
  
  constructor() {
    const sendCommand = Client.prototype.sendCommand as (
      command: string,
      ...args: Client.ValueType[]
    ) => Promise<unknown>;
    const self = this;
    Client.prototype.sendCommand = async function (
      this: Client.Redis,
      command: { name: string; args: string[] },
      ...args: Client.ValueType[]
    ) {
      const name = command.name.toUpperCase();
      const status = () => self.client.status.toUpperCase();
      const data = command.args;
      console.log(`${name} ${status()} -- ms`, { data });
      const start = Date.now();
      await sendCommand.call(this, command, ...args);
      console.log(`${name} ${status()} ${Date.now() - start} ms`, { data });
    };
  }

  async createClient(): Promise<void> {
    if (process.env.REDIS_SWITCH == "true") {
      if (this.client) {
        return;
      }

      this.options = {
        retryStrategy(times) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        db: this.DB,
        lazyConnect: true,
        enableAutoPipelining: true,
        enableOfflineQueue: true,
        connectTimeout: 10000, // 10 sec
      };

      this.options.host = process.env.REDIS_HOST;
      this.options.port = process.env.REDIS_PORT;
      this.options.password = process.env.REDIS_PASSWORD;
      this.client = new Client(this.options);
      this.publisher = new Client(this.options);
      this.subscriber = new Client(this.options);

      this.client.on("ready", () => {
        console.log("Redis connected Successfully...!");
      });

      this.publisher.on("connect", () => {
        console.log("publisher Successfully...!");
      });

      this.subscriber.on("connect", () => {
        console.log("subscriber Successfully...!");
      });

      this.publisher.on("ready", () => {
        console.log("Publisher is ready...!");
      });

      this.subscriber.on("ready", () => {
        console.log("Subscriber is ready...!");
        this.subscribeEvent(false);
      });


      this.client.on("error", (err: Error) => {
        console.log("Error in connecting Redis ------>", err.message);
        console.log(err);
      });
      this.client.on("close", () => {
        console.log("Connection Closed");
      });
      console.log("Connecting ...");
      await this.client.connect();
      await this.publisher.connect();
      await this.subscriber.connect();
    }
  }

  async connect(): Promise<void> {
    try {
      console.log("process.env.REDIS_HOST  ", process.env.REDIS_HOST);
      if (this.client?.status === "connected") {
        console.log("Already Connected");
        return;
      }
      if (!this.client) {
        await this.createClient();
      } else {
        console.log("Connecting ...");
        await this.client.connect();
      }
    } catch (error) {
      console.error("Error in Redis Connect:", error);
    }
  }

  subscribeEvent(config: boolean): void {
    try {
      if (config)
        this.client.config("SET", "", "", (e, r) => {
          if (e) {
            console.log(e);
          }
          console.log(`Redis event subscribed ${r}`);
        });
      else this.subscriber.subscribe("") as unknown;
      return;
    } catch (error) {
      console.error("Error in Redis Subscribe Event:", error);
    }
  }

  async createSession(sessionId: string, session: any) {
    try {
      await this.setSession(sessionId, session);
    } catch (error) {
      console.error("Error in Redis Create Session:", error);
    }
  }

  async setSession(sessionId: string, data: any) {
    try {
      if (this.client) {
        await util.promisify(this.client.hmset.bind(this.client))([
          this.UserSession,
          sessionId,
          JSON.stringify(data),
        ]);
      }
    } catch (error) {
      console.error("[Redis] : ", error);
    }
  }

  async createAdminSession(sessionId: string, session: any) {
    try {
      if (this.client) {
        await util.promisify(this.client.hmset.bind(this.client))([
          this.AdminSession,
          sessionId,
          JSON.stringify(session),
        ]);
      }
    } catch (error) {
      console.error("Error in Redis Create Session Admin:", error);
    }
  }

  async createUserSession(sessionId: string, session: any) {
    try {
      if (this.client) {
        await util.promisify(this.client.hmset.bind(this.client))([
          this.UserSession,
          sessionId,
          JSON.stringify(session),
        ]);
      }
    } catch (error) {
      console.error("Error in Redis Create Session User:", error);
    }
  }

  async findUserSession(sessionId: string) {
    try {
      if (this.client) {
        return new Promise((resolve, reject) => {
          this.client.hget(this.UserSession, sessionId, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(((data && JSON.parse(data)) as any) || null);
            }
          });
        });
      } else {
        console.log("Redis Client Not found");
      }
    } catch (error) {
      console.error("Redis", "Connect", error);
    }
  }

  async findAdminSession(sessionId: string) {
    try {
      if (this.client) {
        return new Promise((resolve, reject) => {
          this.client.hget(this.AdminSession, sessionId, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(((data && JSON.parse(data)) as any) || null);
            }
          });
        });
      } else {
        console.log("Redis Client Not found");
      }
    } catch (error) {
      console.error("Redis", "Connect", error);
    }
  }

  async delAdminSession(session_id: string) {
    try {
      if (this.client) {
        await util.promisify(this.client.hdel.bind(this.client))(
          this.AdminSession,
          session_id
        );
      }
    } catch (error) {
      console.error("[Redis] : ", error);
    }
  }

  async delUserSession(session_id: string) {
    try {
      if (this.client) {
        await util.promisify(this.client.hdel.bind(this.client))(
          this.UserSession,
          session_id
        );
      }
    } catch (error) {
      console.error("[Redis] : ", error);
    }
  }


  disconnect(): void {
    if (this.client?.status === "connected") {
      this.client.disconnect();
    }
  }

  async setData(key: string, data: unknown, expire_time?: any): Promise<void> {
    try {
      console.log(this.client.status);
      await this.client.set(key, JSON.stringify(data));
      await this.client.expire(key, expire_time);
    } catch (error) {
      console.error("[Redis] : ", error);
    }
  }

  async storeKeyWithExpireTime(
    key: string,
    data: string,
    timestamp: number
  ): Promise<void> {
    try {
      console.log(this.client.status);
      await this.client.set(key, data);
      await this.client.pexpireat(key, timestamp);
    } catch (error) {
      console.error("[Redis] : ", error);
    }
  }

  async getData(key: string): Promise<unknown> {
    try {
      console.log(this.client.status);
      return new Promise((resolve, reject) => {
        this.client.get(key, (error, data: string) => {
          if (error) reject(error);
          resolve(JSON.parse(data));
        });
      });
    } catch (error) {
      console.error("Redis", "Connect", error);
    }
  }

  async delData(key: string) {
    try {
      console.log(this.client.status);
      console.log(key);
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error("[Redis] : ", error);
    }
  }

  flushdb() {
    this.client.flushdb((err, success) => {
      if (err) throw err;
      console.log("Flushed");
    });
    return true;
  }
}

export default new RedisDAO();
