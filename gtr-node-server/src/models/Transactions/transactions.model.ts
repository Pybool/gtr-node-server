import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TransactionsSchema = new Schema({
  reference: {
    type: String,
    required: true,
  },
  paymentResponse: {},

  createdAt: {
    type: Date,
    required: true,
  },
});

const Transaction = mongoose.model("transactions", TransactionsSchema);

export default Transaction;
