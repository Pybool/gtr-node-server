import Xrequest from "../../interfaces/extensions.interface";
import Transaction from "../../models/Transactions/transactions.model";
import { RaffleEntryService } from "../Raffle/rafflentries.service";


export class TransactionService {
  static async saveTransaction(req: Xrequest) {
    try {
      const payload = req.body;
      
      const transaction = payload.transactionData;
      const raffleData = payload.raffleData;
      transaction.createdAt = new Date();
      console.log(transaction)
  
      const transactionRecord = await Transaction.create(transaction);
      const result = await RaffleEntryService.createRaffleEntry(req,raffleData);//Vend service for the payment
      if(result.status){
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
    } catch (error: any) {
      throw error;
    }
  }

  // static async generateReceipt(
  //   transaction: any,
  //   checkoutData: any,
  //   orders: any[]
  // ) {
  //   const email: string = checkoutData.account.email;
  //   const date: string = formatDate(new Date().toLocaleString());
  //   const orderId: string = transaction.checkOutId;
  //   const name: string = `${checkoutData.account.firstName} ${checkoutData.account.lastName}`;
  //   const deliveryAddress = checkoutData.address;
  //   const amountPaid: number = transaction?.transaction?.data?.amount;
  //   const paymentChannel: string =
  //     transaction?.transaction?.data?.channel?.replaceAll("_", " ");
  //   const currency: string = transaction?.transaction?.data.currency;
  //   const status: string = transaction?.transaction?.data.status;

  //   let polulatedOrders = [];
  //   for (let order of orders) {
  //     let tempOrder = await order.populate("variants");
  //     tempOrder = await tempOrder.populate("customMenuItems");
  //     tempOrder = await tempOrder.populate("menu");
  //     polulatedOrders.push(tempOrder);
  //   }
  //   const metaData = {
  //     date,
  //     orderId,
  //     email,
  //     name,
  //     deliveryAddress,
  //     amountPaid,
  //     paymentChannel,
  //     currency,
  //     status,
  //   };
  //   mailActions.orders.sendReceiptMail(metaData?.email, metaData, polulatedOrders);
  //   return { metaData, polulatedOrders };
  // }

  
}
