"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const environment_1 = require("../common/environment");
const validator_1 = require("../common/validator");
const userSchema = new mongoose_1.default.Schema({
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
        enum: ['Male', 'Female'],
    },
    //This property is just to express a custom validation. CPF in Brazil is like a Social Security Number used in the USA to identify people.
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validator_1.validateCPF,
            message: '{PATH}: Invalid CPF. ({VALUE})',
        }
    },
    profiles: {
        type: [String],
        required: false,
        enum: ['admin', 'user']
    }
});
userSchema.statics.findByEmail = function (email, projection) {
    return this.findOne({ email }, projection);
};
userSchema.methods.matches = function (password) {
    return bcrypt_1.default.compareSync(password, this.password);
};
userSchema.methods.hasAny = function (...profiles) {
    return profiles.some(profile => this.profiles.indexOf(profile) !== -1);
};
const hashPassword = (user, next) => {
    bcrypt_1.default.hash(user.password, environment_1.environment.security.saltRounds).then(hash => {
        user.password = hash;
        next();
    })
        .catch(next);
};
const saveMiddleware = function (next) {
    !this.isModified('password') ? next() : hashPassword(this, next);
};
const updateMidleware = function (next) {
    !this.getUpdate().password ? next() : hashPassword(this.getUpdate(), next);
};
//Midlewares
userSchema.pre('save', saveMiddleware);
userSchema.pre('findOneAndUpdate', updateMidleware);
userSchema.pre('update', updateMidleware);
exports.User = mongoose_1.default.model('User', userSchema);
