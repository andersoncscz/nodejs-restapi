import { Router } from './router';
import { NotFoundError } from 'restify-errors';
import mongoose from 'mongoose';

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    
    basePath: string
    paginationLimit: number = 2;

    constructor(protected model: mongoose.Model<D>) {
        super();
        this.basePath = `/${model.collection.name}`;
    }
    
    protected prepareOne = (query: mongoose.DocumentQuery<D,D>): mongoose.DocumentQuery<D,D> => {
        return query;
    }

    envelope(document: any): any {
        return Object.assign({
            _links: {
                self: `${this.basePath}/${document._id}`
            }},
            document.toJSON()
        );
    }


    envelopAll(documents: any[], options: any = {}): any {
        
        const { page, numberOfRecords, paginationLimit, url } = options;
        //Sets 'self' with the Current url
        const resource: any = {
            _links: {
                self: `${url}`,
            },            
            data: documents,
        }

        if (page && numberOfRecords && paginationLimit) {
            
            //Calculates the total of remaining pages.
            const remainingToShow = numberOfRecords - (page * paginationLimit);

            //Creates a link to the previous pagination, only if the current page is higher than 1
            if (page > 1) {
                resource._links.previous = `${this.basePath}?_page=${page - 1}`;
            }
            
            //Creates a link to the next pagination, only if there's still data to show.
            if (remainingToShow > 0) {
                resource._links.next = `${this.basePath}?_page=${page + 1}`;
            }
        }
        return resource;
    }


    //Validates ids
    validateId = (req, res, next) => !mongoose.Types.ObjectId.isValid(req.params.id) ? next(new NotFoundError('Document not found')) : next();


    find = (req, res, next) => {
        
        //Controls the pagination
        let page: number = parseInt(req.query._page || 1);
        const skip: number = ((page > 0 ? page : 1) - 1) * this.paginationLimit;
        
        this.model.countDocuments({}).exec()
            .then(numberOfRecords => {
                this.model.find()
                        .skip(skip)
                        .limit(this.paginationLimit)
                        .then(this.renderAll(res, next, { page, numberOfRecords, paginationLimit: this.paginationLimit, url: req.url }))
            })
            .catch(next);
    }

    findById = (req, res, next) => {
        this.prepareOne(this.model.findById(req.params.id))
            .then(this.render(res, next))
            .catch(next);
    }


    save = (req, res, next) => {
        
        const document = new this.model(req.body);

        document.save()
            .then(this.render(res, next))
            .catch(next);
    }

    replace = (req, res, next) => {
            
        const where = { _id: req.params.id }
        const options = { overwrite: true, runValidators: true, }
        
        this.model.update(where, req.body, options).exec()
            .then(() => this.model.findById(req.params.id))
            .then(this.render(res, next))
            .catch(next);
    }

    update = (req, res, next) => {
        
        const where = { _id: req.params.id }
        const options = {runValidators: true, new : true}
       
        this.model.findOneAndUpdate(where, req.body, options)
            .then(() => this.model.findById(req.params.id))
            .then(this.render(res, next))
            .catch(next);
         
    }

    delete = (req, res, next) => {
        this.model.deleteOne({_id: req.params.id}).exec().then(result => {
            result.n ? res.send(204) : next(new NotFoundError('Document not found'));
            next();
        })
        .catch(next);
    }

}