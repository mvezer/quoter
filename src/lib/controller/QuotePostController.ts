import { QuoteSchema } from './../model/schema/QuoteSchema';
import { IQuotePostControllerConfig } from "./IController";
import { Request, IReply, IRouteConfiguration } from "hapi";
import { ARouteController } from "./ARouteController";
import * as Joi from "joi";

export default class QuotePostController extends ARouteController {


    protected config: IQuotePostControllerConfig;

    constructor(config: IQuotePostControllerConfig) {
        super(config);
    }

    routeHandler = async (request: Request, reply: IReply): Promise<void> => {
        return new Promise<void>(async (resolve, reject) => {
            let value: any;
            this.validate(request.payload, QuoteSchema)
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

    async validate(buffer: any, schema: Joi.Schema): Promise<any> {
        return new Promise<Buffer>((resolve, reject) => {
            Joi.validate<any, void>(buffer, schema, (err: Joi.ValidationError, value: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(value);
                }
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