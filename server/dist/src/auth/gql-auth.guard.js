"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GqlAuthGuard = void 0;
const passport_1 = require("@nestjs/passport");
const graphql_1 = require("@nestjs/graphql");
class GqlAuthGuard extends (0, passport_1.AuthGuard)('local') {
    constructor() {
        super();
    }
    getRequest(context) {
        const ctx = graphql_1.GqlExecutionContext.create(context);
        const request = ctx.getContext();
        request.body = ctx.getArgs().loginUserInput;
        return request;
    }
}
exports.GqlAuthGuard = GqlAuthGuard;
