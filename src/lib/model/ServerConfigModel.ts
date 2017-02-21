import * as NConf from "nconf"
import * as ConfigUtil from "../util/ConfigUtil";
import {IServerConfigModel} from "./IModel"

export default class ServerConfigModel implements IServerConfigModel {
    private configFileName: string;
    constructor(configFileName: string) {
        this.init(configFileName);
    }
    init(configFileName: string) {
        this.configFileName = configFileName;
        NConf.argv()
            .env()
            .file({ file: configFileName });
    }

    public get(key: string): string {
        return NConf.get(key);
    }

    public getEnv(varName: string) {
        return NConf.get(ConfigUtil.getEnvFormattedName(varName));
    }


}