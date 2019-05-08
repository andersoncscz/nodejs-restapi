"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan_1 = __importDefault(require("bunyan"));
const environment_1 = require("./environment");
exports.logger = bunyan_1.default.createLogger({
    name: environment_1.environment.log.name,
    level: bunyan_1.default.resolveLevel(environment_1.environment.log.level)
});
