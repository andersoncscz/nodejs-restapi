import restify from 'restify';
import { BadRequestError } from 'restify-errors';

const mergePatchContentType = 'application/merge-patch+json';

export const mergePatchBodyParser = (req: restify.Request, res: restify.Response, next) => {
    //Verifies if Request Content Type is equals 'application/merge-patch+json' and the request method is equals 'PATCH'
    if (req.getContentType() === mergePatchContentType && req.method === 'PATCH') {
        try {
            //Saves the raw body before transfoms it
            (<any>req).rawBody = req.body;
            //Transform the body using ContentType: application/merge-patch+json
            req.body = JSON.parse(req.body);
        } catch (error) {
            return next(new BadRequestError(`Invalid content: ${error.message}`));
        }
    }

    next();
}