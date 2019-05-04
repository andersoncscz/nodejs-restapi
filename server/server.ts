import fs from 'fs';
import restify from 'restify'
import mongoose from 'mongoose';

import { environment } from '../common/environment';
import { Router } from '../common/router';
import { mergePatchBodyParser } from './merge-patch.parser';
import { errorHandler } from './error.handler';
import { tokenParser } from '../security/token.parser';

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
                }

                if(environment.security.enableHTTPS) {
                    options.certificate = fs.readFileSync(environment.security.certificate),
                    options.key = fs.readFileSync(environment.security.key)
                }

                this.application = restify.createServer(options);
                
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
        return mongoose.disconnect().then(() => this.application.close());
    }
}