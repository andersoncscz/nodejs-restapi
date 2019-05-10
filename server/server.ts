import fs from 'fs';
import restify from 'restify'
import corsMiddleware from 'restify-cors-middleware';
import mongoose from 'mongoose';

import { environment } from '../common/environment';
import { Router } from '../common/router';
import { mergePatchBodyParser } from './merge-patch.parser';
import { errorHandler } from './error.handler';
import { tokenParser } from '../security/token.parser';
import { logger } from '../common/logger';

export class Server {

    application: restify.Server;

    initDataBase = (): Promise<mongoose.Mongoose> => {
        
        return mongoose.connect(
            environment.database.url, {
                useNewUrlParser: true
            }
        )
    }
    
    initRouter = (routers: Router[]): Promise<any> => {
        return new Promise((resolve, reject) => {
            try {

                const options: restify.ServerOptions = {
                    name: 'node-restify-api',
                    version: '1.0.0',
                    log: logger
                }

                
                const corsOptions: corsMiddleware.Options = {
                    preflightMaxAge: 86400, //Caches the preflight request for 1 day (86400), it's avoid making preflight requests everytime.
                    origins: ['*'], //All origins allowed in this example.
                    allowHeaders: ['authorization'], //for JWT
                    exposeHeaders: ['x-custom-header'] //Exposes to client our custom headers, if we have any. It's only an example.
                }        
                
                const cors: corsMiddleware.CorsMiddleware = corsMiddleware(corsOptions);

                if(environment.security.enableHTTPS) {
                    options.certificate = fs.readFileSync(environment.security.certificate),
                    options.key = fs.readFileSync(environment.security.key)
                }

                //Creates the server instance.
                this.application = restify.createServer(options);

                //Applies CORs for preflight requests.
                this.application.pre(cors.preflight)

                //Applies a request logger
                this.application.pre(restify.plugins.requestLogger({ log: logger }));

                //Applies CORs for valid routes.
                this.application.use(cors.actual)

                //Applies the parser for query string
                this.application.use(restify.plugins.queryParser());
                
                //Applies the bodyparser
                this.application.use(restify.plugins.bodyParser());
                
                //Applies the bodyparser transform for patch methods
                this.application.use(mergePatchBodyParser);

                //Applies the token parser middleware
                this.application.use(tokenParser);

                //Applies a callback function for handle errors
                this.application.on('restifyError', errorHandler);

                //Applies the restify audit logger. events: pre, routed, or after.
                this.application.on('after', restify.plugins.auditLogger({ log: logger, event: 'after' }));

                //Applies all routes of each router.
                for (const router of routers) {
                    router.applyRoutes(this.application);
                }

                this.application.listen(environment.server.port, () => resolve(this.application));

            } catch (error) {
                reject(error);
            }
        })
    }
 
    bootstrap = async (routers: Router[] = []): Promise<any> => {
        try {

            await this.initDataBase();
            await this.initRouter(routers);
            return this;

        } catch (error) {
            throw new Error(error)
        }
    }

    shutdown = async () => {
        await mongoose.disconnect();
        return this.application.close();
    }
}