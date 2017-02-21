export interface IServerConfigModel {
    get(key: any): any;
    init? (configFileName: string);
    getEnv(key:string):any;
}
