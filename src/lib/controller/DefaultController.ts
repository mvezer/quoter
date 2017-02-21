import { ARouteController } from "./ARouteController";
import { Request, IReply, IRouteConfiguration } from "hapi";

export default class DefaultController extends ARouteController {
    routeHandler = (request: Request, reply: IReply) => {
        reply.file("public/view/quoteform.html");
    }
}