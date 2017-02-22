import * as Schema from './../model/Schema';
import { IQuotePostControllerConfig } from "./IController";
import { Request, IReply, IRouteConfiguration } from "hapi";
import { ARouteController } from "./ARouteController";
import * as ValidationUtil from "../util/ValidationUtil";

export default class QuotePostController extends ARouteController {
    protected config: IQuotePostControllerConfig;
    constructor(config: IQuotePostControllerConfig) {
        super(config);
    }

    routeHandler = async (request: Request, reply: IReply): Promise<void> => {
        return new Promise<void>(async (resolve, reject) => {
            let value: any;
            ValidationUtil.validate(request.payload, Schema.QuoteSchema)
                .then(async (payload) => {
                    await this.config.messageBrokerService.publish(this.config.routingKey, payload);
                    this.replyOk(reply);
                    resolve();
                })
                .catch((error) => {
                    this.replyError(reply, error);
                    error.isJoi ? resolve() : reject(error);  // not rejecting validation errors
                })
        });
    }

    private replyOk(reply: IReply) {
        reply.file("public/view/ok.html");
    }

    private replyError(reply: IReply, err: Error) {
        reply.response("<h2>There was an error:</h2><p>" + err.message + "</p><a href='/'>Go back to the form</a>")
    }
}