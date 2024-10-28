import express from "express";
import { decode, decodeExt, ensureAdmin } from "../middlewares/jwt";
import { getMulterConfig } from "../middlewares/uploads";
import transactionController from "../controllers/Transactions/transaction.controller";
const transactionsRouter = express.Router();

transactionsRouter.get(
  "/paystack/verify-transaction",
  decodeExt,
  transactionController.verifyTransaction
);

transactionsRouter.post(
  "/save-transaction",
  decodeExt,
  transactionController.saveTransaction
);

export default transactionsRouter;
