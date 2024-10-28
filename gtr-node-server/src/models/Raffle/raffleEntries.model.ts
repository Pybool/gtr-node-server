import mongoose, { Schema, Document, Model } from "mongoose";
import Xrequest from "../../interfaces/extensions.interface";
import { IRaffleDraw } from "./raffle.model";

// Define the RaffleEntry interface
interface IRaffleEntry extends Document {
  userId: mongoose.Types.ObjectId;
  raffleDraw: mongoose.Types.ObjectId;
  phone?: string;
  purchasedTickets: number;
  ticketNumbers: number[];
}

// Extend the Model to include the custom static method
interface RaffleEntryModel extends Model<IRaffleEntry> {
  createRaffleEntry(
    req: Xrequest,
    userId: mongoose.Types.ObjectId,
    phone: string | null,
    raffleDraw: any,
    purchasedTickets: number
  ): Promise<IRaffleEntry>;
  getLastTicketNumber(raffleDrawId: string): Promise<number>;
  selectRandomTickets(raffleDrawId: string, count: number): Promise<number[]>;
  findWinningTickets(
    contestCode: string,
    ticketNumbersToFind: number[]
  ): Promise<any>;
}

// Define the Schema
const raffleEntrySchema = new Schema<IRaffleEntry, RaffleEntryModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "accounts", required: false },
    raffleDraw: {
      type: Schema.Types.ObjectId,
      ref: "RaffleDraw",
      required: true,
    },
    phone: { type: String, required: false },
    purchasedTickets: { type: Number, required: true },
    ticketNumbers: [{ type: Number, required: true }],
  },
  { timestamps: true }
);

// Implement the custom static method
raffleEntrySchema.statics.createRaffleEntry = async function (
  req,
  userId: mongoose.Types.ObjectId,
  phone: string | null = null,
  raffleDraw: any,
  purchasedTickets: number
) {
  const lastEntry = await this.findOne({ raffleDraw: raffleDraw }).sort({
    ticketNumbers: -1,
  });
  const lastTicketNumber = lastEntry ? Math.max(...lastEntry.ticketNumbers) : 0;

  // Generate consecutive ticket numbers
  const newTickets = Array.from(
    { length: purchasedTickets },
    (_, i) => lastTicketNumber + i + 1
  );

  // Create and save the new raffle entry for un-authenticated user
  if (!req.accountId && !userId && !phone) {
    throw new Error("Cannot identify user");
  }

  if (req.accountId) {
    // Create and save the new raffle entry for authenticated user
    return this.create({
      userId: req.accountId || userId,
      purchasedTickets,
      raffleDraw: raffleDraw,
      ticketNumbers: newTickets,
    });
  } else {
    if (phone) {
      //Phone number was passed for anonymous user
      return this.create({
        phone: phone,
        purchasedTickets,
        raffleDraw: raffleDraw,
        ticketNumbers: newTickets,
      });
    }
  }
};

// Get the last ticket number generated
raffleEntrySchema.statics.getLastTicketNumber = async function (
  raffleDrawId: string
) {
  const lastEntry = await this.findOne({ raffleDraw: raffleDrawId }).sort({
    ticketNumbers: -1,
  });
  console.log("lastEntry ", lastEntry, raffleDrawId);
  return lastEntry ? Math.max(...lastEntry.ticketNumbers) : 0;
};

// Select random unique tickets within the ticket range
raffleEntrySchema.statics.selectRandomTickets = async function (
  raffleDrawId: string,
  count: number
) {
  const firstTicketNumber = 1; // Assuming tickets start at 1
  const lastTicketNumber = await this.getLastTicketNumber(raffleDrawId);
  if (lastTicketNumber === 0) return []; // No tickets generated yet

  const uniqueTickets = new Set<number>();
  while (uniqueTickets.size < count) {
    const randomTicket =
      Math.floor(Math.random() * (lastTicketNumber - firstTicketNumber + 1)) +
      firstTicketNumber;
    uniqueTickets.add(randomTicket);
  }

  return Array.from(uniqueTickets);
};

// Update the RaffleEntry schema with the new static method
raffleEntrySchema.statics.findWinningTickets = async function (
  contestCode: string,
  ticketNumbersToFind: number[]
) {
  // Step 1: Find the raffle draw by the contest code
  const raffleDraw: any = await mongoose
    .model("RaffleDraw")
    .findOne({ contestCode }, "_id contestCode winningTickets")
    .lean();

  if (!raffleDraw) {
    throw new Error("No raffle draw found with the given contest code.");
  }

  const matchingEntries = await this.find({
    raffleDraw: raffleDraw._id,
    ticketNumbers: { $in: ticketNumbersToFind },
  }).populate("raffleDraw");

  return matchingEntries;
};

// Export the RaffleEntry model with the static method
const RaffleEntry = mongoose.model<IRaffleEntry, RaffleEntryModel>(
  "RaffleEntry",
  raffleEntrySchema
);
export default RaffleEntry;
