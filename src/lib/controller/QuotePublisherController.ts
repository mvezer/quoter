import { AController } from "./AController";
import * as Hapi from "hapi";
import { IRouteController } from "./IController";
import { IQuotePublisherControllerConfig } from "./IController"

export default class QuotePublisherController extends AController {
    protected config: IQuotePublisherControllerConfig;
    private server: Hapi.Server;

    constructor(config: IQuotePublisherControllerConfig) {
        super();
        this.config = config;
    }

    connect() {
        this.server = new Hapi.Server();
        this.server.connection(this.config.httpServerConfig);
        this.config.httpServerPlugins.forEach((plugin) => { this.server.register(plugin) }, this);
    }

    addRouteController(routeController: IRouteController): QuotePublisherController {
        if (!this.server) {
            this.connect();
        }
        this.server.route(routeController.getRouteConfiguration());
        return this;
    }

    start(): QuotePublisherController {
        if (!this.server) {
            this.connect();
        }
        this.server.start();
        return this;
    }
}