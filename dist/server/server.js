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
const restify_1 = __importDefault(require("restify"));
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = require("../common/environment");
const merge_patch_parser_1 = require("./merge-patch.parser");
const error_handler_1 = require("./error.handler");
class Server {
    constructor() {
        this.initDataBase = () => {
            return mongoose_1.default.connect(environment_1.environment.database.url, {
                useNewUrlParser: true
            });
        };
        this.initRouter = (routers) => {
            return new Promise((resolve, reject) => {
                try {
                    this.application = restify_1.default.createServer({
                        name: 'node-restify-api',
                        version: '1.0.0'
                    });
                    //Applies the parser for query string
                    this.application.use(restify_1.default.plugins.queryParser());
                    //Applies the bodyparser
                    this.application.use(restify_1.default.plugins.bodyParser());
                    //Applies the bodyparser transform for patch methods
                    this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                    //Applies a callback function for handle errors
                    this.application.on('restifyError', error_handler_1.errorHandler);
                    //Applies all routes of each router.
                    for (const router of routers) {
                        router.applyRoutes(this.application);
                    }
                    this.application.listen(environment_1.environment.server.port, () => resolve(this.application));
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.bootstrap = (routers = []) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.initDataBase();
                yield this.initRouter(routers);
                return this;
            }
            catch (error) {
                throw new Error(error);
            }
        });
        this.shutdown = () => __awaiter(this, void 0, void 0, function* () {
            return mongoose_1.default.disconnect().then(() => this.application.close());
        });
    }
}
exports.Server = Server;
