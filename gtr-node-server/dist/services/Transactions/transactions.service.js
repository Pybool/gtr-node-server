"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const transactions_model_1 = __importDefault(require("../../models/Transactions/transactions.model"));
const rafflentries_service_1 = require("../Raffle/rafflentries.service");
class TransactionService {
    static async saveTransaction(req) {
        try {
            const payload = req.body;
            const transaction = payload.transactionData;
            const raffleData = payload.raffleData;
            transaction.createdAt = new Date();
            console.log(transaction);
            const transactionRecord = await transactions_model_1.default.create(transaction);
            const result = await rafflentries_service_1.RaffleEntryService.createRaffleEntry(req, raffleData); //Vend service for the payment
            if (result.status) {
                return {
                    status: true,
                    message: "New raffle entry was created for this payment",
                    data: result,
                    code: 201,
                };
            }
            return {
                status: true,
                message: "Transaction created & saved",
                data: transactionRecord,
                code: 201,
            };
        }
        catch (error) {
            throw error;
        }
    }
}
exports.TransactionService = TransactionService;
