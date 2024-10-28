import axios from "axios";
import { NextFunction, Response } from "express";
import Xrequest from "../../interfaces/extensions.interface";
import { TransactionService } from "../../services/Transactions/transactions.service";

const transactionController: any = {
  saveTransaction: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await TransactionService.saveTransaction(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  verifyTransaction: async (
    req: Xrequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const reference = req.query.ref!;
      const apiUrl = `https://api.paystack.co/transaction/verify/${reference}?external=1`;
      const key = `GHANATALKSRADIO_${process.env.NODE_ENV!.toUpperCase()}_PAYSTACK_SECRET_KEY`;
      console.log("Payment verification ", reference, process.env[key]);

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env[key]}`,
      };

      const response = await axios.get(apiUrl, { headers });

      if (response.data && response.data.status) {
        // Assuming response.data.data contains the result of the transaction verification
        const result = response.data;
        return res.status(200).json(result);
      } else {
        return res
          .status(400)
          .json({ message: "Transaction verification failed" });
      }
    } catch (error: any) {
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

export default transactionController;
