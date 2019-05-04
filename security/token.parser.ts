import restify from 'restify';
import jwt from 'jsonwebtoken';

import { User } from '../users/users.model';
import { environment } from '../common/environment';


export const tokenParser: restify.RequestHandler = (req, res, next) => {
    const token = extractToken(req);
    if (token) {
        jwt.verify(token, environment.security.apiSecret, applyBearer(req, next));
    }
    else {
        next();
    }
}


const extractToken = (req: restify.Request) => {
    
    let token = undefined;
    const authorization = req.header('authorization');
    
    if (authorization) {
        const parts: string[] = authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
        }
    }
    return token;
}

const applyBearer = (req: restify.Request, next) => (error, decoded):void => {
    if (decoded) {
        User.findByEmail(decoded.sub)
            .then(user => {
                if (user) {
                    req.authenticated = user; //Applies a new property to req object. See more in index.d.ts in root path.
                }
                next();
            })
            .catch(next)
    }
    else {
        next();
    }
}