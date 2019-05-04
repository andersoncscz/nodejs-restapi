"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_model_1 = require("../users/users.model");
const environment_1 = require("../common/environment");
exports.tokenParser = (req, res, next) => {
    const token = extractToken(req);
    if (token) {
        jsonwebtoken_1.default.verify(token, environment_1.environment.security.apiSecret, applyBearer(req, next));
    }
    else {
        next();
    }
};
const extractToken = (req) => {
    let token = undefined;
    const authorization = req.header('authorization');
    if (authorization) {
        const parts = authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
        }
    }
    return token;
};
const applyBearer = (req, next) => (error, decoded) => {
    if (decoded) {
        users_model_1.User.findByEmail(decoded.sub)
            .then(user => {
            if (user) {
                req.authenticated = user; //Applies a new property to req object. See more in index.d.ts in root path.
            }
            next();
        })
            .catch(next);
    }
    else {
        next();
    }
};
