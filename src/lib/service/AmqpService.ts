import * as AmqpLib from "amqplib";
import { IAmqpServiceConfig } from "./IService";
import { AService } from "./AService";
import * as ConfigUtil from "../util/ConfigUtil";

export default class AmqpService extends AService {
    protected config: IAmqpServiceConfig;
    private connection: AmqpLib.Connection;
    private channel: AmqpLib.Channel;

    constructor(config: IAmqpServiceConfig) {
        super();
        this.config = config;
    }

    async connect(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                this.connection = await AmqpLib.connect(ConfigUtil.createUrl(this.config));
            } catch (error) {
                reject(error);
            }

            resolve();
        });
    }

    async createChannel(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            
            if (!this.isConnected()) {
                try {
                    await this.connect();
                } catch (error) {
                    console.log(error);
                    return reject(error);
                }
            }

            this.connection.createChannel()
                .then((channel) => { this.channel = channel; resolve(); })
                .catch((err) => { reject(err) });

        });
    }

    async publish(routingKey: string, data: any): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            if (!this.hasChannel) {
                try {
                    await this.createChannel();
                } catch (error) {
                    reject(error);
                }
            }

            this.channel.assertQueue(routingKey);
            this.channel.sendToQueue(routingKey, new Buffer(JSON.stringify(data)));
            console.log(data);
            console.log('message sent');
            resolve();
        });
    }

    async consume(routingKey: string, onMessage: Function): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            if (!this.hasChannel) {
                try {
                    await this.createChannel();
                } catch (error) {
                    reject(error);
                }
            }

            try {
                await this.channel.assertQueue(routingKey);
            } catch (error) {
                reject(error);
            }

            try {
                await this.channel.consume(routingKey, async (msg: AmqpLib.Message) => {
                    console.log("Received: %s", msg.content.toString());
                    onMessage(msg.content.toString());
                    this.channel.ack(msg);
                });
            } catch (error) {
                reject(error);
            }

            resolve();
        });
    }

    isConnected(): boolean {
        return this.connection !== undefined && this.connection != null;
    }

    get hasChannel(): boolean {
        return this.isConnected && this.channel !== undefined;
    }


}