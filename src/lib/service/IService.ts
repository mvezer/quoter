export interface IConfig {

}

export interface IConnectionConfig extends IConfig {
    host:string;
    protocol?:string;    
    port?:string|number;
    user?:string;
    password?:string;
    family?:string|number;
}

export interface IAmpqServiceConfig extends IConnectionConfig {
    queueName:string;
    defaulteExchange?:string;
}

export interface IRedisServiceConfig extends IConnectionConfig {
    lastIdKey:string;
    defaultId:number;
    keySeparator:string;
}

export interface IService {
    isConnected():boolean;
}
