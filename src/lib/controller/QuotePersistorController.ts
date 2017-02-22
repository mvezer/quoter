import * as Schema from './../model/Schema';
import { AController } from "./AController";
import { IQuotePersistorControllerConfig } from "./IController";
import * as ValidationUtil from "../util/ValidationUtil";
import * as AmqpLib from "amqplib";

export default class QuotePersistorController extends AController {
    protected config: IQuotePersistorControllerConfig;

    constructor(config: IQuotePersistorControllerConfig) {
        super();
        this.config = config;
    }

    async start(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                await this.connectServices();
                await this.config.messageBrokerService.consume(this.config.routingKey, this.onQuoteMessageReceived);
            } catch (error) {
                reject(error);
            }
            resolve();
        });
    }

    async connectServices(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Promise.all([
                this.config.messageBrokerService.connect(),
                this.config.storageService.connect()
            ])
                .then(() => { resolve(); })
                .catch((error) => { reject(error); });
        });
    }

    onQuoteMessageReceived = async (message: AmqpLib.Message): Promise<void> => {
        return new Promise<void>(async (resolve, reject) => {
            const messageText = message.content.toString();
            console.log("Message received: ", messageText);
            ValidationUtil.validate(message.content.toString(), Schema.QuoteSchema)
                .then(async () => {
                    await this.config.storageService.setIncremental(this.config.keyPrefix, messageText);
                    this.config.messageBrokerService.ack(message);
                    resolve();
                })
                .catch((error) => {
                    console.log("Validation failed: ", error.message);
                    //this.config.messageBrokerService.nack(message); // fixme: process the failed messages
                })
        });

    }

}