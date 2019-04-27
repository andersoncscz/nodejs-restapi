import * as restify from 'restify';
import { NotFoundError } from 'restify-errors';
import { EventEmitter } from 'events';

export abstract class Router extends EventEmitter {
    
    abstract applyRoutes(application: restify.Server);
    
    //Callback function to render successful responses
    render = (res: restify.Response, next: restify.Next) => {
        return (document) => {
            if (document) {
                this.emit('beforeRender', document);
                res.json(document);
            } 
            else {
                throw new NotFoundError('Document not found');
            }
            return next();
        }
    }

    renderAll = (res: restify.Response, next: restify.Next) => {
        return (documents: any[]) => {
            if(documents) {
                //documents.forEach
                for (const document of documents) {
                    this.emit('beforeRender', document);
                }
                res.json(documents);
            }
            else {
                res.json([]);
            }
        }
    }
}