"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_model_1 = require("../users/users.model");
const restify_errors_1 = require("restify-errors");
const environment_1 = require("../common/environment");
exports.authenticate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield users_model_1.User.findByEmail(email, '+password');
        if (user && user.matches(password)) {
            const token = jsonwebtoken_1.default.sign({ sub: user.email, iss: 'nodejs-restapi' }, environment_1.environment.security.apiSecret);
            res.json({
                name: user.name,
                email: user.email,
                accessToken: token
            });
            return next(false);
        }
        else {
            return next(new restify_errors_1.NotAuthorizedError('Invalid Credentials.'));
        }
    }
    catch (error) {
        next(error);
    }
});
