import { IRedisServiceConfig, IAmpqServiceConfig, IConnectionConfig } from "../service/IService";
import { IServerConfigModel } from "../model/IModel";
import { IQuotePublisherControllerConfig, IQuotePersistorControllerConfig } from "../controller/IController";
import * as Hapi from "hapi";
import AmqpService from "../service/AmqpService";
import RedisService from "../service/RedisService"

export function CreateQuotePublisherControllerConfig(configModel: IServerConfigModel): IQuotePublisherControllerConfig {
    return {
        httpServerConfig: {
            host: configModel.getEnv('httpHost'),
            port: configModel.getEnv('httpPort')
        },
        httpServerPlugins: [require("inert")]
    };
}

export function CreateAmpqServiceConfig(configModel: IServerConfigModel): IAmpqServiceConfig {
    return {
        host: configModel.getEnv('quoteBrokerHost'),
        port: configModel.getEnv('quoteBrokerPort'),
        protocol: "amqp",
        user: configModel.getEnv('quoteBrokerUser'),
        password: configModel.getEnv('quoteBrokerPassword'),
        queueName: configModel.getEnv('quoteBrokerQueueName'),
    };
}

export function CreateRedisServiceConfig(configModel: IServerConfigModel): IRedisServiceConfig {
    return {
        host: configModel.getEnv('quoteRedisHost'),
        port: configModel.getEnv('quoteRedisPort'),
        protocol: "redis",
        defaultId: configModel.getEnv('quoteRedisDefaultId'),
        lastIdKey: configModel.getEnv('quoteRedisLastIdKey'),
        keySeparator: configModel.getEnv('quoteRedisKeySeparator')
    };
}

export function CreateQuotePersistorControllerConfig(configModel: IServerConfigModel): IQuotePersistorControllerConfig {
    return {
        messageBrokerService: new AmqpService(this.CreateAmpqServiceConfig(configModel)),
        storageService: new RedisService(this.CreateRedisServiceConfig(configModel)),
        routingKey: configModel.getEnv('quoteBrokerRoutingKey'),
        keyPrefix: configModel.getEnv('quoteRedisKeyPrefix'),
    }
}
