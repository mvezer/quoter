import * as Joi from "joi";

export const QuoteSchema: Joi.Schema = Joi.object().keys({
    author: Joi.string().min(2).max(256).required(),
    quote: Joi.string().min(2).max(2048).required(),
    tags: Joi.string().min(2).max(512).allow("")
});