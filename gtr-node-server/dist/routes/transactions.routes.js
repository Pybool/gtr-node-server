"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_1 = require("../middlewares/jwt");
const transaction_controller_1 = __importDefault(require("../controllers/Transactions/transaction.controller"));
const transactionsRouter = express_1.default.Router();
transactionsRouter.get("/paystack/verify-transaction", jwt_1.decodeExt, transaction_controller_1.default.verifyTransaction);
transactionsRouter.post("/save-transaction", jwt_1.decodeExt, transaction_controller_1.default.saveTransaction);
exports.default = transactionsRouter;
