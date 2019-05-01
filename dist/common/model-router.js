"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const restify_errors_1 = require("restify-errors");
const mongoose = require("mongoose");
class ModelRouter extends router_1.Router {
    constructor(model) {
        super();
        this.model = model;
        this.paginationLimite = 2;
        this.prepareOne = (query) => {
            return query;
        };
        //Validates ids
        this.validateId = (req, res, next) => !mongoose.Types.ObjectId.isValid(req.params.id) ? next(new restify_errors_1.NotFoundError('Document not found')) : next();
        this.find = (req, res, next) => {
            //Controls the pagination
            let page = parseInt(req.query._page || 1);
            const skip = ((page > 0 ? page : 1) - 1) * this.paginationLimite;
            this.model.countDocuments({}).exec()
                .then(numberOfRecords => {
                this.model.find()
                    .skip(skip)
                    .limit(this.paginationLimite)
                    .then(this.renderAll(res, next, { page, numberOfRecords, paginationLimite: this.paginationLimite, url: req.url }));
            })
                .catch(next);
        };
        this.findById = (req, res, next) => {
            this.prepareOne(this.model.findById(req.params.id))
                .then(this.render(res, next))
                .catch(next);
        };
        this.save = (req, res, next) => {
            const document = new this.model(req.body);
            document.save()
                .then(this.render(res, next))
                .catch(next);
        };
        this.replace = (req, res, next) => {
            const where = { _id: req.params.id };
            const options = { overwrite: true, runValidators: true, };
            this.model.update(where, req.body, options).exec()
                .then(() => this.model.findById(req.params.id))
                .then(this.render(res, next))
                .catch(next);
        };
        this.update = (req, res, next) => {
            const where = { _id: req.params.id };
            const options = { runValidators: true, new: true };
            this.model.findOneAndUpdate(where, req.body, options)
                .then(() => this.model.findById(req.params.id))
                .then(this.render(res, next))
                .catch(next);
        };
        this.delete = (req, res, next) => {
            this.model.deleteOne({ _id: req.params.id }).exec().then(result => {
                if (result.n) {
                    res.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Document not found');
                }
                next();
            })
                .catch(next);
        };
        this.basePath = `/${model.collection.name}`;
    }
    envelope(document) {
        return Object.assign({
            _links: {
                self: `${this.basePath}/${document._id}`
            }
        }, document.toJSON());
    }
    envelopAll(documents, options = {}) {
        const { page, numberOfRecords, paginationLimite, url } = options;
        //Sets 'self' with the Current url
        const resource = {
            _links: {
                self: `${url}`,
            },
            data: documents,
        };
        if (page && numberOfRecords && paginationLimite) {
            //Calculates the total of remaining pages.
            const remainingToShow = numberOfRecords - (page * paginationLimite);
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
}
exports.ModelRouter = ModelRouter;
