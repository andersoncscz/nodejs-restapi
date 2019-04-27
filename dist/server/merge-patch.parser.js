"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
const mergePatchContentType = 'application/merge-patch+json';
exports.mergePatchBodyParser = (req, res, next) => {
    //Verifies if Request Content Type is equals 'application/merge-patch+json' and the request method is equals 'PATCH'
    if (req.getContentType() === mergePatchContentType && req.method === 'PATCH') {
        try {
            //Saves the raw body before transfoms it
            req.rawBody = req.body;
            //Transform the body using ContentType: application/merge-patch+json
            req.body = JSON.parse(req.body);
        }
        catch (error) {
            return next(new restify_errors_1.BadRequestError(`Invalid content: ${error.message}`));
        }
    }
    next();
};
