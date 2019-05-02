import restify from 'restify';
import { NotFoundError } from 'restify-errors';
import { EventEmitter } from 'events';

export abstract class Router extends EventEmitter {
    
    abstract applyRoutes(application: restify.Server);
    

    envelope(document: any): any {
        return document;
    }


    envelopAll(documents: any[], options: any = {}): any {
        return documents;
    }


    //Callback function to render successful responses
    render = (res: restify.Response, next: restify.Next) => {
        return (document) => {
            if (document) {
                this.emit('beforeRender', document);
                res.json(this.envelope(document));
            } 
            else {
                throw new NotFoundError('Document not found');
            }
            return next();
        }
    }

    //Callback function to render successful responses
    renderAll = (res: restify.Response, next: restify.Next, options: any = {}) => {
        return (documents: any[]) => {
            if(documents) {
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document);
                    array[index] = this.envelope(document);
                });
                res.json(this.envelopAll(documents, options));
            }
            else {
                res.json(this.envelopAll([]));
            }
            return next();
        }
    }
}