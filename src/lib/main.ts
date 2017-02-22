import DefaultController from "./controller/DefaultController";
import QuotePostController from "./controller/QuotePostController";
import * as Factory from "./util/Factory";
import AmqpService from "./service/AmqpService";
import RedisService from "./service/RedisService";
import ServerConfigModel from "./model/ServerConfigModel";
import QuotePublisherController from "./controller/QuotePublisherController";
import QuotePersistorController from "./controller/QuotePersistorController";
import * as Hapi from "hapi";


async function runPublisherService(config: ServerConfigModel) {
    const publisher: QuotePublisherController =
        new QuotePublisherController(Factory.CreateQuotePublisherControllerConfig(config))
            .addRouteController(new DefaultController({
                method: "GET", path: "/"
            }))
            .addRouteController(new QuotePostController({
                method: "POST", path: "/quote",
                messageBrokerService: new AmqpService(Factory.CreateAmqpServiceConfig(config)),
                routingKey: config.getEnv('quoteBrokerRoutingKey')
            }))
            .start()
    console.log("Publisher service started");
}

async function runPersistorService(config: ServerConfigModel) {
    const persistor: QuotePersistorController =
        new QuotePersistorController(Factory.CreateQuotePersistorControllerConfig(config));
    await persistor.start();
    console.log("Persistor service started");
}

const config: ServerConfigModel = new ServerConfigModel('config.json');
const arg = process.argv[2];

if (arg == "pub" || arg == "publisher") {
    runPublisherService(config);
} else if (arg == "per" || arg == "persistor" || arg == "sub" || arg == "subscriber") {
    runPersistorService(config);
} else {
    console.log("Please specify which service you want to run:\n    [pub|publisher] for the publisher service\nor\n    [per|persistor|sub|subscriber] for the persistor service.")
}