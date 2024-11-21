"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeExt = exports.decode = void 0;
exports.ensureAdmin = ensureAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const accounts_model_1 = __importDefault(require("../models/Accounts/accounts.model"));
const SECRET_KEY = process.env.GHANATALKSRADIO_ACCESS_TOKEN_SECRET || "";
const decode = async (req, res, next) => {
    const reqHeaders = req.headers;
    if (!reqHeaders["authorization"]) {
        return res
            .status(400)
            .json({ success: false, message: "No access token provided" });
    }
    const accessToken = reqHeaders.authorization.split(" ")[1];
    try {
        console.log("JWT ", accessToken);
        const decoded = jsonwebtoken_1.default.verify(accessToken, SECRET_KEY);
        req.accountId = decoded.aud;
        req.account = await accounts_model_1.default.findOne({ _id: req.accountId });
        if (!req.account.active) {
            throw new Error("Account is de-activated");
        }
        return next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};
exports.decode = decode;
const decodeExt = async (req, res, next) => {
    const reqHeaders = req.headers;
    if (!reqHeaders["authorization"]) {
        return next();
    }
    const accessToken = reqHeaders.authorization.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(accessToken, SECRET_KEY);
        req.accountId = decoded.aud;
        req.account = await accounts_model_1.default.findOne({ _id: req.accountId });
        if (!req.account.active) {
            throw new Error("Account is de-activated");
        }
        return next();
    }
    catch (error) {
        console.log(error);
        return next();
    }
};
exports.decodeExt = decodeExt;
function ensureAdmin(req, res, next) {
    try {
        const account = req.account;
        if (!account.active) {
            throw new Error("Account is de-activated");
        }
        if (account && account.role === "ADMIN") {
            next();
        }
        else {
            res.status(403).json({ message: "Forbidden: Account is not an admin" });
        }
    }
    catch (error) {
        return next();
    }
}
