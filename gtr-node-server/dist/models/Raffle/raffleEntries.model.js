"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the Schema
const raffleEntrySchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "accounts", required: false },
    raffleDraw: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "RaffleDraw",
        required: true,
    },
    phone: { type: String, required: false },
    purchasedTickets: { type: Number, required: true },
    ticketNumbers: [{ type: Number, required: true }],
}, { timestamps: true });
// Implement the custom static method
raffleEntrySchema.statics.createRaffleEntry = async function (req, userId, phone = null, raffleDraw, purchasedTickets) {
    const lastEntry = await this.findOne({ raffleDraw: raffleDraw }).sort({
        ticketNumbers: -1,
    });
    const lastTicketNumber = lastEntry ? Math.max(...lastEntry.ticketNumbers) : 0;
    // Generate consecutive ticket numbers
    const newTickets = Array.from({ length: purchasedTickets }, (_, i) => lastTicketNumber + i + 1);
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
    }
    else {
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
raffleEntrySchema.statics.getLastTicketNumber = async function (raffleDrawId) {
    const lastEntry = await this.findOne({ raffleDraw: raffleDrawId }).sort({
        ticketNumbers: -1,
    });
    console.log("lastEntry ", lastEntry, raffleDrawId);
    return lastEntry ? Math.max(...lastEntry.ticketNumbers) : 0;
};
// Select random unique tickets within the ticket range
raffleEntrySchema.statics.selectRandomTickets = async function (raffleDrawId, count) {
    const firstTicketNumber = 1; // Assuming tickets start at 1
    const lastTicketNumber = await this.getLastTicketNumber(raffleDrawId);
    if (lastTicketNumber === 0)
        return []; // No tickets generated yet
    const uniqueTickets = new Set();
    while (uniqueTickets.size < count) {
        const randomTicket = Math.floor(Math.random() * (lastTicketNumber - firstTicketNumber + 1)) +
            firstTicketNumber;
        uniqueTickets.add(randomTicket);
    }
    return Array.from(uniqueTickets);
};
// Update the RaffleEntry schema with the new static method
raffleEntrySchema.statics.findWinningTickets = async function (userIdentity, contestCode, ticketNumbersToFind) {
    // Step 1: Find the raffle draw by the contest code
    const raffleDraw = await mongoose_1.default
        .model("RaffleDraw")
        .findOne({ contestCode }, "_id contestCode winningTickets")
        .lean();
    if (!raffleDraw) {
        throw new Error("No raffle draw found with the given contest code.");
    }
    let matchingEntries = [];
    try {
        matchingEntries = await this.find({
            raffleDraw: raffleDraw._id,
            userId: userIdentity,
            ticketNumbers: { $in: ticketNumbersToFind },
        }).populate("raffleDraw");
    }
    catch {
        if (matchingEntries.length === 0) {
            matchingEntries = await this.find({
                raffleDraw: raffleDraw._id,
                phone: userIdentity,
                ticketNumbers: { $in: ticketNumbersToFind },
            }).populate("raffleDraw");
        }
    }
    return matchingEntries;
};
// Export the RaffleEntry model with the static method
const RaffleEntry = mongoose_1.default.model("RaffleEntry", raffleEntrySchema);
exports.default = RaffleEntry;
