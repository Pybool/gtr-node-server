"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const AccountSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        sparse: true, // Allows null values while maintaining uniqueness
        required: false
    },
    emailConfirmed: {
        type: Boolean,
        required: false,
        default: false,
    },
    dialCode: {
        type: String,
        required: false,
        default: "",
    },
    countryCode: {
        type: String,
        required: false,
        default: "GH",
    },
    phone: {
        type: String,
        required: false,
        default: "",
        unique: true
    },
    phoneConfirmed: {
        type: Boolean,
        required: false,
        default: false,
    },
    acceptedTerms: {
        type: Boolean,
        required: false,
        default: false,
    },
    role: {
        type: String,
        required: false,
        default: "USER",
        enum: ["ADMIN", "USER"]
    },
    active: {
        type: Boolean,
        required: false,
        default: true,
    },
    createdAt: {
        type: Date,
        default: null,
        required: true,
    }
});
const Accounts = mongoose_1.default.model("accounts", AccountSchema);
exports.default = Accounts;
