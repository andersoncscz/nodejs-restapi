"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
const events_1 = require("events");
class Router extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        //Callback function to render successful responses
        this.render = (res, next) => {
            return (document) => {
                if (document) {
                    this.emit('beforeRender', document);
                    res.json(document);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Document not found');
                }
                return next();
            };
        };
        this.renderAll = (res, next) => {
            return (documents) => {
                if (documents) {
                    //documents.forEach
                    for (const document of documents) {
                        this.emit('beforeRender', document);
                    }
                    res.json(documents);
                }
                else {
                    res.json([]);
                }
            };
        };
    }
}
exports.Router = Router;
