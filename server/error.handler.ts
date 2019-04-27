import * as restify from 'restify';

export const errorHandler = (req: restify.Request, res: restify.Response, error, callback) => {
    
    error.toJSON = () => ({ name: error.name, message: error.message });
    
    switch (error.name) {
        
        case 'MongoError':
            if (error.code === 11000)
                error.statusCode = 400;
            break;

        case 'ValidationError':
            error.statusCode = 400;    
            const messages: any[] = [];
            for (const key in error.errors) {
                messages.push({message: error.errors[key].message});
            }
            error.toJSON = () => ({ errors: messages });
            break;

        default:
            break;
    }
    
    return callback();   
}