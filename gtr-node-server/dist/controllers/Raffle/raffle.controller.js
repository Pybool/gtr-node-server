"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const raffle_service_1 = require("../../services/Raffle/raffle.service");
const rafflentries_service_1 = require("../../services/Raffle/rafflentries.service");
const raffleDrawController = {
    createRaffleDraw: async (req, res, next) => {
        try {
            let status = 400;
            const result = await raffle_service_1.RaffleDrawService.createRaffleDraw(req);
            if (result)
                status = result.code;
            return res.status(status).json(result);
        }
        catch (error) {
            error.status = 500;
            next(error);
        }
    },
    activateRaffleDraw: async (req, res, next) => {
        try {
            let status = 400;
            const result = await raffle_service_1.RaffleDrawService.activateRaffleDraw(req);
            if (result)
                status = result.code;
            return res.status(status).json(result);
        }
        catch (error) {
            error.status = 500;
            next(error);
        }
    },
    destroyRaffleDraw: async (req, res, next) => {
        try {
            let status = 400;
            const result = await raffle_service_1.RaffleDrawService.destroyRaffleDraw(req);
            if (result)
                status = result.code;
            return res.status(status).json(result);
        }
        catch (error) {
            error.status = 500;
            next(error);
        }
    },
    createPrize: async (req, res, next) => {
        try {
            let status = 400;
            const result = await raffle_service_1.RaffleDrawService.createPrize(req);
            if (result)
                status = result.code;
            return res.status(status).json(result);
        }
        catch (error) {
            error.status = 500;
            next(error);
        }
    },
    getPrizes: async (req, res, next) => {
        try {
            let status = 400;
            const result = await raffle_service_1.RaffleDrawService.getPrizes();
            if (result)
                status = result.code;
            return res.status(status).json(result);
        }
        catch (error) {
            error.status = 500;
            next(error);
        }
    },
    deletePrize: async (req, res, next) => {
        try {
            let status = 400;
            const result = await raffle_service_1.RaffleDrawService.deletePrize(req);
            if (result)
                status = result.code;
            return res.status(status).json(result);
        }
        catch (error) {
            error.status = 500;
            next(error);
        }
    },
    suspendRaffleDraw: async (req, res, next) => {
        try {
            let status = 400;
            const result = await raffle_service_1.RaffleDrawService.suspendRaffleDraw(req);
            if (result)
                status = result.code;
            return res.status(status).json(result);
        }
        catch (error) {
            error.status = 500;
            next(error);
        }
    },
    getActiveRaffleDraw: async (req, res, next) => {
        try {
            let status = 400;
            const result = await raffle_service_1.RaffleDrawService.getActiveRaffleDraw(req);
            if (result)
                status = result.code;
            return res.status(status).json(result);
        }
        catch (error) {
            error.status = 500;
            next(error);
        }
    },
    checkTicketAvailability: async (req, res, next) => {
        try {
            let status = 400;
            const qty = req.body.qty;
            const result = await rafflentries_service_1.RaffleEntryService.checkTicketAvailability(qty);
            if (result)
                status = result.code;
            return res.status(status).json(result);
        }
        catch (error) {
            error.status = 500;
            next(error);
        }
    },
    fetchRaffleDraws: async (req, res, next) => {
        try {
            let status = 400;
            const result = await raffle_service_1.RaffleDrawService.fetchRaffleDraws(req);
            if (result)
                status = result.code;
            return res.status(status).json(result);
        }
        catch (error) {
            error.status = 500;
            next(error);
        }
    },
    closeRaffleDraw: async (req, res, next) => {
        try {
            let status = 400;
            const result = await raffle_service_1.RaffleDrawService.closeRaffleDraw(req);
            if (result)
                status = result.code;
            return res.status(status).json(result);
        }
        catch (error) {
            error.status = 500;
            next(error);
        }
    },
    searchWinningEntriesTickets: async (req, res, next) => {
        try {
            let status = 400;
            const result = await raffle_service_1.RaffleDrawService.searchWinningEntriesTickets(req);
            if (result)
                status = result.code;
            return res.status(status).json(result);
        }
        catch (error) {
            error.status = 500;
            next(error);
        }
    },
    uploadRaffleDrawBanner: async (req, res, next) => {
        try {
            let status = 400;
            const result = await raffle_service_1.RaffleDrawService.uploadRaffleDrawBanner(req);
            if (result)
                status = result.code;
            return res.status(status).json(result);
        }
        catch (error) {
            error.status = 500;
            next(error);
        }
    },
};
exports.default = raffleDrawController;
