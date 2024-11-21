"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const local_controller_1 = __importDefault(require("../controllers/Authentication/local/local.controller"));
const jwt_1 = require("../middlewares/jwt");
const invalidrequest_1 = require("../middlewares/invalidrequest");
const authRouter = express_1.default.Router();
authRouter.post('/register', jwt_1.decodeExt, local_controller_1.default.createAccount);
authRouter.post('/phone-otp', jwt_1.decodeExt, local_controller_1.default.sendPhoneOtp);
authRouter.post('/email-otp', jwt_1.decodeExt, local_controller_1.default.sendEmailOtp);
authRouter.post('/phone-login', jwt_1.decodeExt, local_controller_1.default.phoneLogin);
authRouter.post('/email-login', jwt_1.decodeExt, local_controller_1.default.emailLogin);
// authRouter.post('/resend-email-verification-otp', authController.sendEmailConfirmationOtp)
// authRouter.post('/send-password-reset-otp', authController.sendPasswordResetLink)
// authRouter.post('/reset-password', authController.resetPassword)
// authRouter.post('/login', authController.loginAccount)
authRouter.post('/refresh-token', local_controller_1.default.getRefreshToken);
authRouter.put('/accept-terms', local_controller_1.default.acceptedTerms);
authRouter.all('/register', invalidrequest_1.handleInvalidMethod);
authRouter.all('/verify-email-address', invalidrequest_1.handleInvalidMethod);
authRouter.all('/resend-email-verification', invalidrequest_1.handleInvalidMethod);
authRouter.all('/send-reset-password-otp', invalidrequest_1.handleInvalidMethod);
authRouter.all('/reset-password', invalidrequest_1.handleInvalidMethod);
authRouter.all('/login', invalidrequest_1.handleInvalidMethod);
authRouter.all('/refresh-token', invalidrequest_1.handleInvalidMethod);
authRouter.all('/user-profile', invalidrequest_1.handleInvalidMethod);
authRouter.all('/user-profile', invalidrequest_1.handleInvalidMethod);
exports.default = authRouter;
