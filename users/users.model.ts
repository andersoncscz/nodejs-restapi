import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

import { environment } from '../common/environment';
import { validateCPF } from '../common/validator';

export interface User extends mongoose.Document {
    name: string,
    email: string,
    password: string
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3,
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },

    password: {
        type: String,
        required: true,
        select: false,
    },

    gender: {
        type: String,
        required: false,
        enum: ['Male','Female'],
    },

    //This property is just to express a custom validation. CPF in Brazil is like a Social Security Number used in the USA to identify people.
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validateCPF,
            message: '{PATH}: Invalid CPF. ({VALUE})',
        }
    }
});

const hashPassword = (user: any, next) => {
    bcrypt.hash(user.password, environment.security.saltRounds).then(hash => {
        user.password = hash;
        next();
    })
    .catch(next);
}

const saveMiddleware = function(this, next) {
    !this.isModified('password') ? next() : hashPassword(this, next);
}

const updateMidleware = function(next) {
    !this.getUpdate().password ? next() : hashPassword(this.getUpdate(), next);
}


//Midlewares
userSchema.pre('save', saveMiddleware);
userSchema.pre('findOneAndUpdate', updateMidleware);
userSchema.pre('update', updateMidleware);


export const User = mongoose.model<User>('User', userSchema);