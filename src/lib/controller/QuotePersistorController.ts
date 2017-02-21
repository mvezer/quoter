import { AController } from "./AController";
import { IQuotePersistorControllerConfig } from "./IController";

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

    private onQuoteMessageReceived = (msg: string) => {
        this.config.storageService.setIncremental(this.config.keyPrefix, msg);
    }

}