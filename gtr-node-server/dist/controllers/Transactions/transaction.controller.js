"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const transactions_service_1 = require("../../services/Transactions/transactions.service");
const transactionController = {
    saveTransaction: async (req, res, next) => {
        try {
            let status = 400;
            const result = await transactions_service_1.TransactionService.saveTransaction(req);
            if (result)
                status = result.code;
            return res.status(status).json(result);
        }
        catch (error) {
            error.status = 500;
            next(error);
        }
    },
    verifyTransaction: async (req, res, next) => {
        try {
            const reference = req.query.ref;
            const apiUrl = `https://api.paystack.co/transaction/verify/${reference}?external=1`;
            const key = `GHANATALKSRADIO_${process.env.NODE_ENV.toUpperCase()}_PAYSTACK_SECRET_KEY`;
            console.log("Payment verification ", reference, process.env[key]);
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env[key]}`,
            };
            const response = await axios_1.default.get(apiUrl, { headers });
            if (response.data && response.data.status) {
                // Assuming response.data.data contains the result of the transaction verification
                const result = response.data;
                return res.status(200).json(result);
            }
            else {
                return res
                    .status(400)
                    .json({ message: "Transaction verification failed" });
            }
        }
        catch (error) {
            error.status = 500;
            next(error);
        }
    },
    // fetchTransactions: async (req: Xrequest, res: Response, next: NextFunction) => {
    //   try {
    //     let status = 400;
    //     const result:any = await TransactionService.fetchTransactions(req);
    //     if (result) status = result?.code || 200;
    //     return res.status(status).json(result);
    //   } catch (error: any) {
    //     error.status = 500;
    //     next(error);
    //   }
    // },
};
exports.default = transactionController;
