"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = (req, res, error, callback) => {
    error.toJSON = () => ({ name: error.name, message: error.message });
    switch (error.name) {
        case 'MongoError':
            if (error.code === 11000)
                error.statusCode = 400;
            break;
        case 'ValidationError':
            error.statusCode = 400;
            const messages = [];
            for (const key in error.errors) {
                messages.push({ message: error.errors[key].message });
            }
            error.toJSON = () => ({ errors: messages });
            break;
        default:
            break;
    }
    return callback();
};
