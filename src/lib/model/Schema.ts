import * as Joi from "joi";

export const QuotePublisherSchema: Joi.Schema = Joi.object().keys({
    author: Joi.string().min(2).max(256).required(),
    quote: Joi.string().min(2).max(2048).required(),
    tags: Joi.string().min(2).max(512).allow("")
});

export const QuotePersistorSchema: Joi.Schema = Joi.object().keys({
    author: Joi.string().min(2).max(256).required(),
    quote: Joi.string().min(2).max(2048).required(),
    tags: Joi.array().items(Joi.string()).max(128)
});

