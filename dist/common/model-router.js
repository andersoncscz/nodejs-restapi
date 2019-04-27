"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const restify_errors_1 = require("restify-errors");
const mongoose = require("mongoose");
class ModelRouter extends router_1.Router {
    constructor(model) {
        super();
        this.model = model;
        this.prepareOne = (query) => {
            return query;
        };
        this.validateId = (req, res, next) => {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return next(new restify_errors_1.NotFoundError('Document not found'));
            }
            next();
        };
        this.find = (req, res, next) => {
            this.model.find()
                .then(this.renderAll(res, next))
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
                .then(result => {
                if (result.n)
                    return this.model.findById(req.params.id);
                throw new restify_errors_1.NotFoundError('Document not found');
            })
                .then(this.render(res, next))
                .catch(next);
        };
        this.update = (req, res, next) => {
            const options = { new: true, runValidators: true, };
            this.model.findOneAndUpdate(req.params.id, req.body, options)
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
    }
}
exports.ModelRouter = ModelRouter;
