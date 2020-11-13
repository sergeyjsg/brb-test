
import * as joi from 'joi';


export const signInSchema = joi.object().keys({
    userId: joi.number().positive().required()
}).required();


export const signUpSchema = joi.object().keys({
    firstName: joi.string().min(3).required(),
    lastName: joi.string().min(3).required(),
    email: joi.string().email().required(),
    role: joi.string().valid('AGENT', 'ADMIN').required()
}).required();


export const listingCreationSchema = joi.object().keys({
    address: joi.string().min(3).required(),
}).required();
