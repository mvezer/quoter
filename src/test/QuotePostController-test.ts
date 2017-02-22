import { IConfig } from './../lib/service/IService';
import { expect } from "chai";
import * as sinon from "sinon";
import QuotePostController from "../lib/controller/QuotePostController";
import { IQuotePostControllerConfig } from "../lib/controller/IController";
import { Request, IReply, IRouteConfiguration } from "hapi";

describe("QuotePostController", () => {
    const quotePostControllerConfig: IQuotePostControllerConfig = {
        routingKey: "routingKey",
        method: "POST",
        path: "/quote",
        messageBrokerService: null
    };

    const validPayload = JSON.parse(' {"author":"Winnie The Pooh","quote":"I prefer hunny over cocaine","tags":"pooh winnie hunny cocaine"} ');
    const invalidPayload = JSON.parse(' {"wrongkey":"Winnie The Pooh","wrongkey2":"","wrongkey3":""} ');

    let validRequest: any;
    let invalidRequest: any;
    let reply: any;
    let quotePostController: any;
    let config: any;

    beforeEach(() => {
        quotePostController = new QuotePostController(quotePostControllerConfig);
        quotePostControllerConfig.messageBrokerService = sinon.stub();
        quotePostControllerConfig.messageBrokerService.publish = sinon.stub().returns(true);
        validRequest = sinon.stub();
        validRequest.payload = validPayload;
        invalidRequest = sinon.stub();
        invalidRequest.payload = invalidPayload;
        reply = sinon.stub();
        reply.file = sinon.stub().returns(true);
        reply.response = sinon.stub().returns(true);
    });

    it("routeHandler should NOT publish the quote that failed validation", (done) => {
        quotePostController.routeHandler(invalidRequest, reply).then(() => {
            sinon.assert.notCalled(quotePostControllerConfig.messageBrokerService.publish);
            done();
        }).catch(done);
    });

    it("routeHandler should publish the quote that passed validation", (done) => {
        quotePostController.routeHandler(validRequest, reply).then(() => {
            sinon.assert.calledOnce(quotePostControllerConfig.messageBrokerService.publish);
            done();
        }).catch(done);
    });
});
