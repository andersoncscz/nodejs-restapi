import { Router } from './router';
import { NotFoundError } from 'restify-errors';
import * as mongoose from 'mongoose';

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    
    constructor(protected model: mongoose.Model<D>) {
        super();
    }

    protected prepareOne = (query: mongoose.DocumentQuery<D,D>): mongoose.DocumentQuery<D,D> => {
        return query;
    }

    validateId = (req, res, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(new NotFoundError('Document not found'));
        }
        next();
    }


    find = (req, res, next) => {
        this.model.find()
            .then(this.renderAll(res, next))
            .catch(next);
    }

    findById = (req, res, next) => {
        this.prepareOne(this.model.findById(req.params.id))
            .then(this.render(res, next))
            .catch(next);
    };


    save = (req, res, next) => {
        const document = new this.model(req.body);
        document.save()
            .then(this.render(res, next))
            .catch(next);
    };

    replace = (req, res, next) => {
            
        const where = { _id: req.params.id }
        const options = { overwrite: true, runValidators: true, }
        
        this.model.update(where, req.body, options).exec()
            .then(result => {
                if (result.n)
                    return this.model.findById(req.params.id);

                throw new NotFoundError('Document not found');
            })
            .then(this.render(res, next))
            .catch(next);
    }

    update = (req, res, next) => {
            
        const options = { new: true, runValidators: true, }

        this.model.findOneAndUpdate(req.params.id, req.body, options)
            .then(this.render(res, next))
            .catch(next);
    }

    delete = (req, res, next) => {
        this.model.deleteOne({_id: req.params.id}).exec().then(result => {
            if(result.n) {
                res.send(204);
            }
            else {
                throw new NotFoundError('Document not found');
            }
            next();
        })
        .catch(next);
    }

}