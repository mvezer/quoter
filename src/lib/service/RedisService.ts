import { AService } from "./AService";
import { IRedisServiceConfig } from "./IService";
import * as  IORedis from "ioredis";
import * as Util from "../util/ConfigUtil";


export default class RedisService extends AService {
    private redis: IORedis.Redis;
    protected config: IRedisServiceConfig;

    constructor(config:IRedisServiceConfig) {
        super();
        this.config = config;
    }


    async connect(): Promise<IORedis.Redis> {
        return new Promise<IORedis.Redis>(async (resolve, reject) => {
            const url = Util.createUrl(this.config);
            try {
                this.redis = await new IORedis(url);
            } catch (error) {
                reject(error);
            }

            console.log("Redis service is connected to %s", url);
            resolve(this.redis);
        });
    }

    private async getIncId(keyPrefix: string): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            var newId = 0;
            try {
                newId = await this.redis.sadd("inc", this.getLastIdKey(keyPrefix));
            } catch (error) {
                reject(error);
            }

            if (!newId) {
                await this.resetIncId(keyPrefix);
                newId = this.config.defaultId;
                resolve(newId);
            }
        });
    }

    private async resetIncId(keyPrefix: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            await this.redis.set(this.getLastIdKey(keyPrefix), this.config.defaultId);
        });
    }

    async setIncremental(keyPrefix: string, value: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            if (!this.isConnected) {
                await this.connect();
            }

            let id = await this.getIncId(keyPrefix);

            try {
                await this.redis.set(this.getKey(keyPrefix, id), value);
            } catch (error) {
                reject(error);
            }
            console.log('value set for good')
            resolve();
        });
    }

    isConnected(): boolean {
        return this.redis !== undefined;
    }

    getLastIdKey(keyPrefix: string): string {
        return keyPrefix + this.config.keySeparator + this.config.lastIdKey;
    }

    getKey(keyPrefix: string, id: number) {
        return keyPrefix + this.config.keySeparator + id;
    }


}