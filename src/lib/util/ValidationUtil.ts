import * as Joi from "joi";

// Promisify the Joi.validate function
export async function validate(buffer: any, schema: Joi.Schema): Promise<any> {
    return new Promise<Buffer>((resolve, reject) => {
        Joi.validate<any, void>(buffer, schema, (err: Joi.ValidationError, value: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        })
    });
}

// quote: "it's not stupid if it works" :)
export function clone(object:Object): Object {
    return JSON.parse(JSON.stringify(object));
}
