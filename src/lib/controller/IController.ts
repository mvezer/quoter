import * as Hapi from "hapi";
import AmqpService from "../service/AmqpService";
import RedisService from "../service/RedisService";

export interface IControllerConfig {
    // 
}

export interface IController {
    isInitialized(): boolean;
}

export interface IRouteController extends IController {
    getRouteConfiguration(): Hapi.IRouteConfiguration;
    routeHandler(request: Hapi.Request, reply: Hapi.IReply);
}

export interface IRouteControllerConfig extends IControllerConfig {
    method: string;
    path: string;
}

export interface IQuotePersistorControllerConfig extends IControllerConfig {
    routingKey: string;
    keyPrefix: string;
    messageBrokerService: AmqpService;
    storageService: RedisService;
}

export interface IQuotePublisherControllerConfig extends IControllerConfig {
    httpServerConfig: Hapi.IServerConnectionOptions,
    httpServerPlugins: any[]
    //routingKey: string;
}

export interface IQuotePostControllerConfig extends IRouteControllerConfig {
    routingKey: string;
    messageBrokerService: AmqpService;
}
