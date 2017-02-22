import { Request, IReply, IRouteConfiguration } from "hapi";
import {IController, IRouteController, IRouteControllerConfig} from "./IController";
import {AController} from "./AController";

export abstract class ARouteController extends AController implements IRouteController {
    protected config: IRouteControllerConfig;

    constructor (config:IRouteControllerConfig) {
        super();
        this.config = config;
    }

    getRouteConfiguration(): IRouteConfiguration {
        return ({
            method: this.config.method,
            path: this.config.path,
            handler: this.routeHandler
        });
    }

    // automatic binding of the extracted method is necessary, otherwise we lose the 'this' context
    abstract routeHandler = (request: Request, reply: IReply) => {};
}
