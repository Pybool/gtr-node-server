"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authentication = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
const redis_service_1 = require("../../redis/redis.service");
const mail_service_1 = __importDefault(require("../Mail/mail.service"));
const joi_validators_1 = __importDefault(require("../../validators/authentication/joi.validators"));
const messages_1 = __importDefault(require("../../helpers/messages"));
const jwt_helper_1 = __importDefault(require("../../helpers/jwt_helper"));
const custom_validators_1 = require("../../validators/authentication/custom.validators");
// import { SmsService } from "./twilio.sms.service";
const dotenv_1 = require("dotenv");
const termii_service_1 = require("./termii.service");
const global_error_handler_1 = require("../../bootstrap/global.error.handler");
const accounts_model_1 = __importDefault(require("../../models/Accounts/accounts.model"));
(0, dotenv_1.config)();
(0, dotenv_1.config)({ path: `.env.${process.env.NODE_ENV}` });
const API_KEY = process.env.TERMII_API_KEY;
// Mapping of country codes to their corresponding dial codes
const countryDialCodes = {
    NG: "234", // Nigeria
    US: "1", // United States
    GH: "233", // Ghana
    UK: "44", // United Kingdom
    // Add more countries as needed
};
// Function to normalize phone numbers
const normalizePhoneNumber = (countryCode, phone) => {
    const dialCode = countryDialCodes[countryCode];
    if (!dialCode) {
        throw new Error("Invalid country code");
    }
    // Remove all non-numeric characters
    let normalizedPhone = phone.replace(/\D/g, "");
    // If the phone number starts with '0', replace it with the dial code
    if (normalizedPhone.startsWith("0")) {
        normalizedPhone = dialCode + normalizedPhone.slice(1);
    }
    // If the phone number doesn't start with the dial code, prepend it
    if (!normalizedPhone.startsWith(dialCode)) {
        normalizedPhone = dialCode + normalizedPhone;
    }
    return normalizedPhone;
};
class Authentication {
    constructor(req) {
        this.req = req;
        this.payload = req.body || {};
    }
    async createAccount() {
        try {
            const session = await mongoose_1.default.startSession();
            const result = await joi_validators_1.default.authSchema.validateAsync(this.req.body);
            const user = await accounts_model_1.default.findOne({ email: result.email }).session(session);
            if (user) {
                throw http_errors_1.default.Conflict(messages_1.default.auth.alreadyExistPartText);
            }
            result.createdAt = new Date();
            if (this.req?.account) {
                if (this.req.account.role === "ADMIN") {
                    result.emailConfirmed = true;
                }
            }
            const pendingAccount = new accounts_model_1.default(result);
            const savedUser = await pendingAccount.save();
            if (savedUser._id.toString()) {
                if (!this.req?.account) {
                    const otp = (0, redis_service_1.generateOtp)();
                    await (0, redis_service_1.setExpirableCode)(result.email, "account-verification", otp);
                    mail_service_1.default.auth.sendEmailConfirmationOtp(result.email, otp);
                }
                return {
                    status: true,
                    data: savedUser._id,
                    message: "Registration successful",
                };
            }
            return { status: false, message: "Registration was unsuccessful!" };
        }
        catch (error) {
            let msg = "Registration was unsuccessful!";
            if (error.message.includes("already exists!")) {
                error.status = 200;
                msg = error.message || "User with email address already exists!";
            }
            return { status: false, message: msg };
        }
    }
    async sendPhoneOtp(messageType) {
        let otpType = "phone-otp-login";
        const phone = this.payload.phone;
        const countryCode = this.payload.countryCode;
        const parsedPhone = normalizePhoneNumber(countryCode, phone);
        const user = await accounts_model_1.default.findOne({ countryCode: countryCode, phone: parsedPhone });
        if (!user) {
            otpType = "phone-otp-register";
            await (0, redis_service_1.setExpirableAccountData)(phone, "pending-account-", {
                phone: parsedPhone,
                countryCode: countryCode,
                dialCode: this.payload?.dialCode,
            });
        }
        else {
            if (!user.active) {
                throw new Error("Account is de-activated");
            }
        }
        const otp = (0, redis_service_1.generateOtp)();
        await (0, redis_service_1.setExpirablePhoneCode)(parsedPhone, otpType, otp);
        console.log("OTP===> ", otp, parsedPhone, otpType);
        const data = {
            api_key: API_KEY,
            message_type: "NUMERIC",
            to: parsedPhone,
            from: "Efielounge",
            channel: "generic",
            pin_attempts: 10,
            pin_time_to_live: 5,
            pin_length: 4,
            pin_placeholder: "< 1234 >",
            message_text: "Your GTR pin is < 1234 >",
            pin_type: "NUMERIC",
        };
        termii_service_1.SmsService.sendSms(messageType, Number(otp), data);
        return {
            status: true,
            code: 200,
        };
    }
    async phoneLogin() {
        let accountId = null;
        let otpType = "phone-otp-login";
        const result = await joi_validators_1.default.authPhoneLoginSchema.validateAsync(this.req.body);
        const phone = result?.phone;
        const countryCode = result.countryCode;
        const parsedPhone = normalizePhoneNumber(countryCode, phone);
        let account = await accounts_model_1.default.findOne({ countryCode: countryCode, phone: parsedPhone });
        if (!account) {
            otpType = "phone-otp-register";
        }
        console.log("GET OTP===> ", parsedPhone, otpType);
        const cachedOtp = await (0, redis_service_1.getExpirablePhoneCode)(otpType, parsedPhone);
        if (!cachedOtp) {
            throw new Error("OTP has expired");
        }
        if (Number(cachedOtp.code) !== result.otp) {
            throw new Error("Otp is invalid");
        }
        if (!account) {
            const pendingAccount = await (0, redis_service_1.getExpirableAccountData)("pending-account-", phone);
            if (pendingAccount) {
                pendingAccount.createdAt = new Date();
                account = await accounts_model_1.default.create(pendingAccount);
            }
            else {
                throw Error("Request a new otp and try again");
            }
        }
        else {
            if (!account.active) {
                throw new Error("Account is de-activated");
            }
        }
        accountId = account._id?.toString();
        const accessToken = await jwt_helper_1.default.signAccessToken(accountId);
        const refreshToken = await jwt_helper_1.default.signRefreshToken(accountId);
        return { status: true, data: account, accessToken, refreshToken };
    }
    async sendEmailOtp(messageType) {
        let otpType = "email-otp-login";
        const email = this.payload.email;
        const user = await accounts_model_1.default.findOne({ email: email });
        if (!user) {
            otpType = "email-otp-register";
            await (0, redis_service_1.setExpirableAccountData)(email, "pending-account-", {
                email: email,
            });
        }
        else {
            if (!user.active) {
                throw new Error("Account is de-activated");
            }
        }
        const otp = (0, redis_service_1.generateOtp)();
        await (0, redis_service_1.setExpirableCode)(email, otpType, otp);
        console.log("OTP===> ", otp);
        mail_service_1.default.auth.sendEmailConfirmationOtp(email, otp);
        return {
            status: true,
            code: 200,
        };
    }
    async emailLogin() {
        let otpType = "email-otp-login";
        const result = await joi_validators_1.default.authEmailLoginSchema.validateAsync(this.req.body);
        let account = await accounts_model_1.default.findOne({ email: result.email });
        if (!account) {
            otpType = "email-otp-register";
        }
        const cachedOtp = await (0, redis_service_1.getExpirableCode)(otpType, result.email);
        console.log("Existing login otp ==> ", cachedOtp);
        if (!cachedOtp) {
            throw new Error("OTP has expired");
        }
        console.log(Number(cachedOtp.code), result.otp);
        if (Number(cachedOtp.code) !== result.otp) {
            throw new Error("Otp is invalid");
        }
        if (!account) {
            const pendingAccount = await (0, redis_service_1.getExpirableAccountData)("pending-account-", result?.email);
            if (pendingAccount) {
                pendingAccount.createdAt = new Date();
                account = await accounts_model_1.default.create(pendingAccount);
            }
            else {
                throw Error("Request a new otp and try again");
            }
        }
        else {
            if (!account.active) {
                throw new Error("Account is de-activated");
            }
        }
        const accessToken = await jwt_helper_1.default.signAccessToken(account.id);
        const refreshToken = await jwt_helper_1.default.signRefreshToken(account.id);
        return { status: true, data: account, accessToken, refreshToken };
    }
    async acceptedTerms(req) {
        const accountId = req.body.accountId;
        let account = await accounts_model_1.default.findOne({ _id: accountId });
        if (account) {
            account.acceptedTerms = true;
            account = await account.save();
            return {
                status: true,
                data: account,
                message: "Terms Accepted",
                code: 200
            };
        }
        return {
            status: false,
            data: null,
            message: "No account was found...",
            code: 200
        };
    }
    async sendEmailConfirmationOtp() {
        try {
            const result = await joi_validators_1.default.authSendEmailConfirmOtpSchema.validateAsync(this.req.body);
            const user = await accounts_model_1.default.findOne({ email: result.email });
            if (!user) {
                throw http_errors_1.default.NotFound(custom_validators_1.utils.joinStringsWithSpace([
                    result.email,
                    messages_1.default.auth.notRegisteredPartText,
                ]));
            }
            if (user.emailConfirmed) {
                return { status: false, message: messages_1.default.auth.emailAlreadyVerified };
            }
            const otp = (0, redis_service_1.generateOtp)();
            await (0, redis_service_1.setExpirableCode)(result.email, "account-verification", otp);
            return await mail_service_1.default.auth.sendEmailConfirmationOtp(result.email, otp);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async verifyAccountEmail() {
        const { otp, email } = this.req.body;
        if (!otp) {
            return { status: false, message: messages_1.default.auth.missingConfToken };
        }
        const cachedOtp = await (0, redis_service_1.getExpirableCode)("account-verification", email);
        if (!cachedOtp || cachedOtp?.code.toString() !== otp.toString()) {
            return {
                status: false,
                message: "This otp is incorrect or has expired...",
            };
        }
        try {
            const account = await accounts_model_1.default.findOne({ email });
            if (!account.emailConfirmed) {
                account.emailConfirmed = true;
                await account.save();
                return { status: true, message: messages_1.default.auth.emailVerifiedOk };
            }
            return { status: false, message: "Account already verified!" };
        }
        catch (error) {
            console.log(error);
            return { status: false, message: messages_1.default.auth.invalidConfToken };
        }
    }
    async getRefreshToken(next) {
        try {
            const { refreshToken } = this.req.body;
            if (!refreshToken)
                throw http_errors_1.default.BadRequest();
            const { aud } = (await jwt_helper_1.default.verifyRefreshToken(refreshToken, next));
            if (aud) {
                const accessToken = await jwt_helper_1.default.signAccessToken(aud);
                // const refToken = await jwthelper.signRefreshToken(aud);
                return { status: true, accessToken: accessToken };
            }
        }
        catch (error) {
            console.log(error);
            return { status: false, message: error.mesage };
        }
    }
}
exports.Authentication = Authentication;
__decorate([
    (0, global_error_handler_1.handleErrors)()
], Authentication.prototype, "createAccount", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], Authentication.prototype, "sendPhoneOtp", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], Authentication.prototype, "phoneLogin", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], Authentication.prototype, "sendEmailOtp", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], Authentication.prototype, "emailLogin", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], Authentication.prototype, "acceptedTerms", null);
