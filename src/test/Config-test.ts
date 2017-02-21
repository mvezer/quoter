import { expect } from "chai";
import * as sinon from "sinon";
import * as ConfigUtil from "../lib/util/ConfigUtil";

describe("ConfigUtil", () => {
    it('getEnvFormattedName should convert camel case variable name to environment variable format', (done)=> {
        expect(ConfigUtil.getEnvFormattedName("camelCaseName")).to.equal("CAMEL_CASE_NAME");
        expect(ConfigUtil.getEnvFormattedName("nocamelcasename")).to.equal("NOCAMELCASENAME");
        expect(ConfigUtil.getEnvFormattedName("NOCAMELCASENAME")).to.equal("NOCAMELCASENAME");
        expect(ConfigUtil.getEnvFormattedName("NO_CAMEL_CASE_NAME")).to.equal("NO_CAMEL_CASE_NAME");
        expect(ConfigUtil.getEnvFormattedName("")).to.equal("");
        done();
    });

    it('createUrl should generate valid urls', (done)=> {
        expect(ConfigUtil.createUrl({protocol:"ampql",host:"localhost"})).to.equal("ampql://localhost");
        expect(ConfigUtil.createUrl({protocol:"ampql",host:"localhost",port:5672})).to.equal("ampql://localhost:5672");
        expect(ConfigUtil.createUrl({protocol:"ampql",host:"localhost",port:5672,username:"username"})).to.equal("ampql://username@localhost:5672");
        expect(ConfigUtil.createUrl({protocol:"ampql",host:"localhost",port:5672,username:"username",password:"password"})).to.equal("ampql://username:password@localhost:5672");
        done();
    });
});
