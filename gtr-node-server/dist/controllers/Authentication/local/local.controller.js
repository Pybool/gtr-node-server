"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_local_service_1 = require("../../../services/Auth/authentication.local.service");
const authController = {
    createAccount: async (req, res, next) => {
        let status = 200;
        try {
            const authentication = new authentication_local_service_1.Authentication(req);
            const result = await authentication.createAccount();
            if (result.status) {
                status = 201;
                res.status(status).json(result);
            }
            else {
                console.log("result ", result);
                return res.status(200).json(result);
            }
        }
        catch (error) {
            console.log("Auth error ", error.message);
            if (error.isJoi === true) {
                error.status = 422;
            }
            res.status(status).json({ status: false, message: error?.message });
        }
    },
    acceptedTerms: async (req, res, next) => {
        let status = 200;
        try {
            const authentication = new authentication_local_service_1.Authentication(req);
            const result = await authentication.acceptedTerms(req);
            if (result.status) {
                status = 201;
                res.status(status).json(result);
            }
            else {
                return res.status(200).json(result);
            }
        }
        catch (error) {
            res.status(status).json({ status: false, message: error?.message });
        }
    },
    phoneLogin: async (req, res, next) => {
        let status = 200;
        try {
            const authentication = new authentication_local_service_1.Authentication(req);
            const result = await authentication.phoneLogin();
            if (result.status) {
                status = 200;
                res.status(status).json(result);
            }
            else {
                console.log("result ", result);
                return res.status(200).json(result);
            }
        }
        catch (error) {
            console.log("Auth error ", error.message);
            if (error.isJoi === true) {
                error.status = 422;
            }
            res.status(status).json({ status: false, message: error?.message });
        }
    },
    emailLogin: async (req, res, next) => {
        let status = 200;
        try {
            const authentication = new authentication_local_service_1.Authentication(req);
            const result = await authentication.emailLogin();
            if (result.status) {
                status = 200;
                res.status(status).json(result);
            }
            else {
                console.log("result ", result);
                return res.status(200).json(result);
            }
        }
        catch (error) {
            console.log("Auth error ", error.message);
            if (error.isJoi === true) {
                error.status = 422;
            }
            res.status(status).json({ status: false, message: error?.message });
        }
    },
    sendPhoneOtp: async (req, res, next) => {
        let status = 200;
        try {
            const authentication = new authentication_local_service_1.Authentication(req);
            const messageType = req.body.messageType;
            const result = await authentication.sendPhoneOtp(messageType);
            if (result.status) {
                status = 201;
                res.status(status).json(result);
            }
            else {
                console.log("result ", result);
                return res.status(200).json(result);
            }
        }
        catch (error) {
            console.log("Auth error ", error.message);
            if (error.isJoi === true) {
                error.status = 422;
            }
            res.status(status).json({ status: false, message: error?.message });
        }
    },
    sendEmailOtp: async (req, res, next) => {
        let status = 200;
        try {
            const authentication = new authentication_local_service_1.Authentication(req);
            const messageType = req.body.messageType;
            const result = await authentication.sendEmailOtp(messageType);
            if (result.status) {
                status = 201;
                res.status(status).json(result);
            }
            else {
                console.log("result ", result);
                return res.status(200).json(result);
            }
        }
        catch (error) {
            console.log("Auth error ", error.message);
            if (error.isJoi === true) {
                error.status = 422;
            }
            res.status(status).json({ status: false, message: error?.message });
        }
    },
    verifyAccountEmail: async (req, res, next) => {
        try {
            let status = 400;
            const authentication = new authentication_local_service_1.Authentication(req);
            const result = await authentication.verifyAccountEmail();
            if (result.status)
                status = 200;
            res.status(status).json(result);
        }
        catch (error) {
            error.status = 422;
            next(error);
        }
    },
    getRefreshToken: async (req, res, next) => {
        try {
            let status = 400;
            const authentication = new authentication_local_service_1.Authentication(req);
            if (req.body.refreshToken == "") {
                res.status(200).json({ status: false });
            }
            const result = await authentication.getRefreshToken(next);
            if (result)
                status = 200;
            res.status(status).json(result);
        }
        catch (error) {
            error.status = 422;
            next(error);
        }
    },
};
exports.default = authController;
