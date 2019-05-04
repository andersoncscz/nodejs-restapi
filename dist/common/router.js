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
                    res.json(this.envelope(document));
                }
                else {
                    throw new restify_errors_1.NotFoundError('Document not found');
                }
                return next(false);
            };
        };
        //Callback function to render successful responses
        this.renderAll = (res, next, options = {}) => {
            return (documents) => {
                if (documents) {
                    documents.forEach((document, index, array) => {
                        this.emit('beforeRender', document);
                        array[index] = this.envelope(document);
                    });
                    res.json(this.envelopAll(documents, options));
                }
                else {
                    res.json(this.envelopAll([]));
                }
                return next(false);
            };
        };
    }
    envelope(document) {
        return document;
    }
    envelopAll(documents, options = {}) {
        return documents;
    }
}
exports.Router = Router;
