import restify from 'restify';
import jwt from 'jsonwebtoken';

import { User } from '../users/users.model';
import { NotAuthorizedError } from 'restify-errors';
import { environment } from '../common/environment';

export const authenticate: restify.RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email, '+password');
        if (user && user.matches(password)) {
            const token = jwt.sign({ sub: user.email, iss: 'nodejs-restapi' }, environment.security.apiSecret);
            res.json({
                name: user.name,
                email: user.email,
                accessToken: token
            });
            return next(false);
        }
        else {
            return next(new NotAuthorizedError('Invalid Credentials.'))
        }
    } catch (error) {
        next(error)
    }
}