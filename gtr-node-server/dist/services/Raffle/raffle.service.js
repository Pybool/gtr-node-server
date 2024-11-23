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
exports.RaffleDrawService = void 0;
const global_error_handler_1 = require("../../bootstrap/global.error.handler");
const logger_1 = __importDefault(require("../../bootstrap/logger"));
const prizes_model_1 = __importDefault(require("../../models/Raffle/prizes.model"));
const raffle_model_1 = __importDefault(require("../../models/Raffle/raffle.model"));
const raffleEntries_model_1 = __importDefault(require("../../models/Raffle/raffleEntries.model"));
const termii_service_1 = require("../Auth/termii.service");
const mail_service_1 = __importDefault(require("../Mail/mail.service"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: `.env.${process.env.NODE_ENV}` });
const API_KEY = process.env.TERMII_API_KEY;
class RaffleDrawService {
    static async createRaffleDraw(req) {
        const requestBody = req.body;
        const payload = requestBody;
        payload.createdAt = new Date();
        const flatPrizes = [];
        for (let prize of payload.prizes) {
            flatPrizes.push(prize.id);
        }
        payload.prizes = flatPrizes;
        payload.isActive = true;
        payload.contestCode = await RaffleDrawService.generateContestCode();
        await raffle_model_1.default.updateMany({}, { $set: { isActive: false } } //When a new draw is created disable all other draws
        );
        if (payload.useCompetitionDetailsAsDefault) {
            await raffle_model_1.default.updateMany({}, { $set: { useCompetitionDetailsAsDefault: false } } //When a new draw is created disable all other draws
            );
        }
        const raffleDraw = await raffle_model_1.default.create(payload);
        if (raffleDraw) {
            return {
                status: true,
                message: "RaffleDraw has been created succesfully.",
                data: raffleDraw,
                code: 201,
            };
        }
        return {
            status: false,
            message: "RaffleDraw creation failed.",
            data: null,
            code: 422,
        };
    }
    static async uploadRaffleDrawBanner(req) {
        try {
            const attachments = req.attachments;
            const requestBody = req.body;
            const raffleDrawId = requestBody.raffleDrawId;
            let raffleDraw = await raffle_model_1.default.findOne({
                _id: raffleDrawId,
            });
            if (!raffleDraw) {
                return {
                    status: false,
                    message: "No such raffle draw exists..",
                    code: 404,
                };
            }
            if (attachments?.length == 0) {
                return {
                    status: false,
                    message: "No valid images were sent",
                    data: null,
                    code: 400,
                };
            }
            raffleDraw.bannerUrl = attachments[0];
            raffleDraw = await raffleDraw.save();
            return {
                status: true,
                data: raffleDraw,
                message: "Raffle draw banner uploaded successfully",
                code: 201,
            };
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    static async activateRaffleDraw(req) {
        return {
            status: true,
            message: "",
            code: 200,
        };
    }
    static async destroyRaffleDraw(req) {
        return {
            status: true,
            message: "",
            code: 200,
        };
    }
    static async createPrize(req) {
        const requestBody = req.body;
        console.log(req.attachments);
        const payload = JSON.parse(requestBody.data);
        let prizeAttachments = req.attachments;
        if (prizeAttachments.length == 0 ||
            req.files.length != prizeAttachments.length) {
            return {
                status: false,
                message: "Prize creation failed, no valid images were sent",
                data: null,
                code: 422,
            };
        }
        payload.image = prizeAttachments[0]?.url;
        payload.createdAt = new Date();
        const prize = await prizes_model_1.default.create(payload);
        if (prize) {
            return {
                status: true,
                message: "Prize has been created succesfully.",
                data: prize,
                code: 201,
            };
        }
        return {
            status: false,
            message: "Prize creation failed.",
            data: null,
            code: 422,
        };
    }
    static async getActiveRaffleDraw(req) {
        let userActiveRaffleTickets = [];
        const activeRaffleDraw = await raffle_model_1.default.findOne({
            isActive: true,
        }).populate("prizes");
        if (activeRaffleDraw) {
            if (activeRaffleDraw.competitionDetails.length == 0) {
                activeRaffleDraw.competitionDetails =
                    await RaffleDrawService.getDefaultCompetitionDetails();
            }
            const accountId = req.accountId;
            if (accountId) {
                console.log("Active User tickets ==> ", {
                    userId: req.accountId,
                    raffleDraw: activeRaffleDraw._id,
                });
                userActiveRaffleTickets = await raffleEntries_model_1.default.find({
                    userId: accountId,
                    raffleDraw: activeRaffleDraw._id,
                });
            }
            else {
                const phone = req.query.phone;
                userActiveRaffleTickets = await raffleEntries_model_1.default.find({
                    phone: phone,
                    raffleDraw: activeRaffleDraw._id,
                });
            }
        }
        return {
            status: true,
            message: "Raffle Draw has been fetched succesfully.",
            data: activeRaffleDraw,
            userActiveRaffleTickets,
            code: 200,
        };
    }
    static async getPrizes() {
        const prizes = await prizes_model_1.default.find();
        return {
            status: true,
            message: "Prize has been fetched succesfully.",
            data: prizes,
            code: 200,
        };
    }
    static async deletePrize(req) {
        const prizes = await prizes_model_1.default.deleteOne({ _id: req.query.id });
        return {
            status: true,
            message: "Prize has been deleted succesfully.",
            data: prizes,
            code: 200,
        };
    }
    static async suspendRaffleDraw(req) {
        const activeRaffleResult = await RaffleDrawService.getActiveRaffleDraw(req);
        if (activeRaffleResult.status) {
            const activeRaffleDraw = activeRaffleResult.data;
            if (activeRaffleDraw?.isTerminated) {
                return {
                    status: false,
                    message: "Cannot close an already terminated raffle draw",
                    code: 400,
                };
            }
            activeRaffleDraw.isActive = false;
            activeRaffleDraw.isTerminated = true;
            await activeRaffleDraw.save();
            return {
                status: true,
                message: "Raffle draw has been terminated",
                code: 200,
            };
        }
        return {
            status: false,
            message: "This raffle draw is not active",
            code: 400,
        };
    }
    static async fetchRaffleDraws(req) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const raffleDraws = await raffle_model_1.default.find()
            .sort({ createdAt: -1 })
            .populate("prizes")
            .skip(skip)
            .limit(limit);
        const totalDocuments = await raffle_model_1.default.countDocuments();
        const totalPages = Math.ceil(totalDocuments / limit);
        return {
            status: true,
            message: "Raffle Draws have been fetched successfully.",
            data: raffleDraws,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                limit: limit,
                totalDocuments: totalDocuments,
            },
            code: 200,
        };
    }
    static async closeRaffleDraw(req) {
        const activeRaffleResult = await RaffleDrawService.getActiveRaffleDraw(req);
        if (activeRaffleResult.status) {
            const activeRaffleDraw = activeRaffleResult.data;
            if (activeRaffleDraw?.isTerminated) {
                return {
                    status: false,
                    message: "Cannot close an already terminated raffle draw",
                    code: 400,
                };
            }
            activeRaffleDraw.isActive = false;
            activeRaffleDraw.raffleEndDate = new Date();
            // await activeRaffleDraw.save()
            const winnersResult = await RaffleDrawService.selectRaffleDrawWinners(activeRaffleDraw._id?.toString(), activeRaffleDraw.maxWinners);
            const winningTickets = winnersResult.data;
            activeRaffleDraw.winningTickets = winningTickets;
            activeRaffleDraw.isTerminated = true;
            await activeRaffleDraw.save();
            if (winnersResult) {
                console.log(" Winners data ", winnersResult.data);
                await RaffleDrawService.sendWinnersNotification(activeRaffleDraw, winnersResult.data);
            }
            return {
                status: true,
                message: "Raffle draw has been closed and winners selected",
                data: activeRaffleDraw,
                code: 200,
            };
        }
    }
    static async selectRaffleDrawWinners(raffleDrawId, winnersCount) {
        const randomTickets = await raffleEntries_model_1.default.selectRandomTickets(raffleDrawId, winnersCount);
        //Send sms or emails to winners
        return {
            status: true,
            data: randomTickets,
        };
    }
    static async searchWinningEntriesTickets(req) {
        const userIdentity = req.accountId || req.body.phone;
        const contestCode = req.body.contestCode;
        const tickets = req.body.tickets;
        const winners = (await raffleEntries_model_1.default.findWinningTickets(userIdentity, contestCode, tickets)) || [];
        const found = [];
        if (winners.length > 0) {
            const winningTickets = winners[0].raffleDraw.winningTickets;
            for (let _test_ticket of tickets) {
                if (winningTickets.includes(_test_ticket)) {
                    found.push(_test_ticket);
                }
            }
        }
        let msg = "No wining tickets were found for the tickets you provided";
        if (found.length > 0) {
            msg = `These are winning ticket(s) on this raffle draw: ${found
                .toString()
                ?.trim()
                .replaceAll(",", " , ")}`;
        }
        return {
            status: true,
            message: msg,
            data: winners,
            found,
            code: 200,
        };
    }
    static async generateContestCode() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2); // Last two digits of the year
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Two-digit month
        const day = date.getDate().toString().padStart(2, "0"); // Two-digit day
        let contestCode = `GTR-${year}${month}${day}`;
        const exists = await raffle_model_1.default.findOne({ contestCode });
        if (exists) {
            return contestCode + `${Math.floor(Date.now() / 1000)}`;
        }
        return contestCode;
    }
    static async getDefaultCompetitionDetails() {
        const competitionWithDefault = await raffle_model_1.default.findOne({
            useCompetitionDetailsAsDefault: true,
        });
        return competitionWithDefault?.competitionDetails;
    }
    static async sendWinnersNotification(raffleDraw, winningTickets) {
        const contestCode = raffleDraw.contestCode;
        const winners = await raffleEntries_model_1.default.aggregate([
            {
                $match: {
                    ticketNumbers: { $in: winningTickets },
                    raffleDraw: raffleDraw._id,
                },
            },
            {
                $project: {
                    userId: "$userId",
                    winningTickets: {
                        $filter: {
                            input: "$ticketNumbers",
                            as: "ticket",
                            cond: { $in: ["$$ticket", winningTickets] },
                        },
                    },
                },
            },
            {
                $group: {
                    _id: "$userId",
                    winningTickets: { $addToSet: "$winningTickets" },
                },
            },
            {
                $project: {
                    _id: 1,
                    winningTickets: {
                        $reduce: {
                            input: "$winningTickets",
                            initialValue: [],
                            in: { $concatArrays: ["$$value", "$$this"] },
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "accounts", // Replace with your actual Users collection name
                    localField: "_id", // userId from RaffleEntry
                    foreignField: "_id", // _id in Users collection
                    as: "userDetails",
                },
            },
            {
                $unwind: "$userDetails", // Flatten the userDetails array into a single object
            },
            {
                $project: {
                    _id: 1,
                    winningTickets: 1,
                    email: "$userDetails.email",
                    phone: "$userDetails.phone",
                },
            },
        ]);
        console.log(JSON.stringify(winners, null, 2));
        for (let winner of winners) {
            if (winner) {
                const email = winner.email;
                const phone = winner.phone;
                const validateEmail = (email) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(email);
                };
                if (validateEmail(email)) {
                    mail_service_1.default.orders.sendRaffleCongratsMail(email, { ticketNumbers: winner.winningTickets, createdAt: new Date() }, contestCode);
                }
                if (phone !== "") {
                    //send sms
                    const data = {
                        api_key: API_KEY,
                        message_type: "NUMERIC",
                        to: phone,
                        from: "Ghanatalksradio",
                        channel: "generic",
                        pin_attempts: 10,
                        pin_time_to_live: 5,
                        pin_length: 4,
                        pin_placeholder: "< 1234 >",
                        message_text: "Your GTR pin is < 1234 >",
                        pin_type: "NUMERIC",
                    };
                    try {
                        termii_service_1.SmsService.sendSms("WIN", { contestCode, tickets: winner.winningTickets.join(",") }, data);
                        logger_1.default.info("Sms sent successfully");
                    }
                    catch {
                        //Fail silently
                        logger_1.default.info("Failed to send sms");
                    }
                }
            }
        }
    }
}
exports.RaffleDrawService = RaffleDrawService;
__decorate([
    (0, global_error_handler_1.handleErrors)()
], RaffleDrawService, "createRaffleDraw", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], RaffleDrawService, "uploadRaffleDrawBanner", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], RaffleDrawService, "activateRaffleDraw", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], RaffleDrawService, "destroyRaffleDraw", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], RaffleDrawService, "createPrize", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], RaffleDrawService, "getActiveRaffleDraw", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], RaffleDrawService, "getPrizes", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], RaffleDrawService, "deletePrize", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], RaffleDrawService, "suspendRaffleDraw", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], RaffleDrawService, "fetchRaffleDraws", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], RaffleDrawService, "closeRaffleDraw", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], RaffleDrawService, "selectRaffleDrawWinners", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], RaffleDrawService, "searchWinningEntriesTickets", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], RaffleDrawService, "generateContestCode", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], RaffleDrawService, "getDefaultCompetitionDetails", null);
__decorate([
    (0, global_error_handler_1.handleErrors)()
], RaffleDrawService, "sendWinnersNotification", null);
