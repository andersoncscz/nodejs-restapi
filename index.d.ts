import { User } from './users/users.model';

declare module 'restify' {
    //Exports a Request interface from restify with a new property, used in 'token.parser.ts' where the object 'req' will have a property 'authenticated' type User: req.authenticated = user;
    export interface Request {
        authenticated: User
    }
}