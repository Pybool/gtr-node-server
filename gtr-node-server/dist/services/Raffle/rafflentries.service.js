"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaffleEntryService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const global_error_handler_1 = require("../../bootstrap/global.error.handler");
const raffleEntries_model_1 = __importDefault(require("../../models/Raffle/raffleEntries.model"));
const raffle_model_1 = __importDefault(require("../../models/Raffle/raffle.model"));
const mail_service_1 = __importDefault(require("../Mail/mail.service"));
const dotenv_1 = require("dotenv");
const termii_service_1 = require("../Auth/termii.service");
(0, dotenv_1.config)({ path: `.env.${process.env.NODE_ENV}` });
const API_KEY = process.env.TERMII_API_KEY;
class RaffleEntryService {
    static async createRaffleEntry(req, raffleData) {
        let newEntry = null;
        const activeRaffleDraw = await raffle_model_1.default.findOne({ isActive: true });
        const ticketAvailableResult = await RaffleEntryService.checkTicketAvailability(raffleData.qty);
        if (!ticketAvailableResult.status) {
            return ticketAvailableResult;
        }
        if (activeRaffleDraw) {
            raffleData.raffleDraw = activeRaffleDraw?._id;
        }
        if (!req.accountId) {
            newEntry = await raffleEntries_model_1.default.createRaffleEntry(req, new mongoose_1.default.Types.ObjectId(req.accountId), raffleData.phone, raffleData.raffleDraw, raffleData.qty);
        }
        else {
            newEntry = await raffleEntries_model_1.default.createRaffleEntry(req, new mongoose_1.default.Types.ObjectId(req.accountId), raffleData.phone, raffleData.raffleDraw, raffleData.qty);
        }
        if (newEntry) {
            if (activeRaffleDraw) {
                activeRaffleDraw.ticketSold += newEntry.purchasedTickets;
                await activeRaffleDraw.save();
            }
            console.log("Raffle entry created:", newEntry);
            if (req.account.email) {
                mail_service_1.default.orders.sendReceiptMail(req.account.email, newEntry, activeRaffleDraw?.contestCode);
            }
            else {
                if (raffleData?.phone) {
                    const data = {
                        api_key: API_KEY,
                        message_type: "NUMERIC",
                        to: raffleData.phone,
                        from: "Efielounge",
                        channel: "generic",
                        pin_attempts: 10,
                        pin_time_to_live: 5,
                        pin_length: 4,
                        pin_placeholder: "< 1234 >",
                        message_text: "Your GTR pin is < 1234 >",
                        pin_type: "NUMERIC",
                    };
                    termii_service_1.SmsService.sendSms("TICKETS", {
                        contestCode: activeRaffleDraw?.contestCode,
                        tickets: newEntry.ticketNumbers.toString(),
                    }, data);
                }
            }
            return {
                status: true,
                message: "Raffle entry created:",
                data: newEntry,
                code: 200,
            };
        }
        else {
            return {
                status: false,
                message: "Raffle entry could not be created:",
                data: null,
                code: 200,
            };
        }
    }
    static async checkTicketAvailability(qty) {
        const activeRaffleDraw = await raffle_model_1.default.findOne({ isActive: true });
        if (activeRaffleDraw) {
            const availableTickets = activeRaffleDraw.maxEntries - activeRaffleDraw.ticketSold;
            if (availableTickets < qty) {
                return {
                    status: false,
                    message: `There are only ${availableTickets} tickets left`,
                    code: 200,
                };
            }
            else {
                return {
                    status: true,
                    message: `Requested ticket quantity is available`,
                    code: 200,
                };
            }
        }
        else {
            return {
                status: false,
                message: "No active raffle draw at the moment , please try again later",
                code: 200,
            };
        }
    }
}
exports.RaffleEntryService = RaffleEntryService;
__decorate([
    (0, global_error_handler_1.handleErrors)()
], RaffleEntryService, "createRaffleEntry", null);
