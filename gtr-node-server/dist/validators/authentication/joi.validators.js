"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const authSchema = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().required(),
    password: joi_1.default.string().min(4).required(),
    userName: joi_1.default.string(),
    role: joi_1.default.string()
});
const authPhoneSchema = joi_1.default.object({
    phone: joi_1.default.string().required(),
    otp: joi_1.default.number().required(),
    countryCode: joi_1.default.string().required(),
    dialCode: joi_1.default.string().required(),
});
const authEmailSchema = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().required(),
    otp: joi_1.default.number().required()
});
const authPhoneLoginSchema = joi_1.default.object({
    dialCode: joi_1.default.string().required(),
    countryCode: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    otp: joi_1.default.number().required()
});
const authEmailLoginSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    otp: joi_1.default.number().required()
});
const authSendEmailConfirmOtpSchema = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().required(),
});
const authSendResetPasswordLink = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().required(),
});
const authResetPassword = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().required(),
    otp: joi_1.default.string().required(),
    password: joi_1.default.string().min(4).required(),
});
const validations = {
    authSchema,
    authSendEmailConfirmOtpSchema,
    authSendResetPasswordLink,
    authResetPassword,
    authPhoneSchema,
    authPhoneLoginSchema,
    authEmailLoginSchema,
    authEmailSchema
};
exports.default = validations;
