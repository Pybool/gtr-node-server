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
// Create the RaffleDraw Schema
const RaffleDrawSchema = new mongoose_1.Schema({
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
    bannerUrl: { type: String, required: false },
    winningTickets: [],
    prizes: [{
            type: mongoose_1.Schema.Types.ObjectId,
            required: false,
            ref: "prizes",
        }],
    isTerminated: { type: Boolean, required: false },
    isActive: { type: Boolean, required: true },
    useCompetitionDetailsAsDefault: { type: Boolean, required: false },
});
// Create the RaffleDraw Model
const RaffleDraw = mongoose_1.default.model("RaffleDraw", RaffleDrawSchema);
exports.default = RaffleDraw;
