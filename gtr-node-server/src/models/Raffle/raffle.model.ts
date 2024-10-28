import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the RaffleDraw document
export interface IRaffleDraw extends Document {
  raffleEndDate: Date;
  raffleName: string;
  maxEntries: number;
  contestCode: string;
  ticketSold: number;
  ticketPrice: number;
  maxTicket: number;
  maxWinners: number;
  description: string;
  competitionDetails: { message: string }[];
  prizes: any;
  createdAt: Date;
  isActive?: boolean;
  isTerminated?:boolean;
  bannerUrl: string,
  winningTickets: number[];
  useCompetitionDetailsAsDefault: boolean;
}

// Create the RaffleDraw Schema
const RaffleDrawSchema: Schema = new Schema({
  raffleEndDate: { type: Date, required: true },
  createdAt: { type: Date, required: true },
  raffleName: { type: String, required: true },
  maxEntries: { type: Number, required: true },
  contestCode: { type: String, required: true },
  ticketSold: { type: Number, required: true },
  ticketPrice: { type: Number, required: true },
  maxTicket: { type: Number, required: true },
  maxWinners: { type: Number, required: true },
  description: { type: String, required: true },
  competitionDetails: [
    {
      message: { type: String, required: true },
    },
  ],
  bannerUrl:{ type: String, required: false },
  winningTickets: [],
  prizes: [{
    type: Schema.Types.ObjectId,
    required: false,
    ref: "prizes",
  }],
  isTerminated:{ type: Boolean, required: false },
  isActive: { type: Boolean, required: true },
  useCompetitionDetailsAsDefault:{ type: Boolean, required: false },
});

// Create the RaffleDraw Model
const RaffleDraw = mongoose.model<IRaffleDraw>("RaffleDraw", RaffleDrawSchema);

export default RaffleDraw;
