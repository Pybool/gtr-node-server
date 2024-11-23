"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_1 = require("../middlewares/jwt");
const uploads_1 = require("../middlewares/uploads");
const raffle_controller_1 = __importDefault(require("../controllers/Raffle/raffle.controller"));
const raffleDrawRouter = express_1.default.Router();
raffleDrawRouter.post("/raffle/create-event", jwt_1.decode, jwt_1.ensureAdmin, raffle_controller_1.default.createRaffleDraw);
raffleDrawRouter.post("/raffle/create-prize", jwt_1.decode, jwt_1.ensureAdmin, (0, uploads_1.getMulterConfig)("./public/raffledraws/", "object"), raffle_controller_1.default.createPrize);
raffleDrawRouter.get("/raffle/fetch-prizes", jwt_1.decodeExt, 
// ensureAdmin,
raffle_controller_1.default.getPrizes);
raffleDrawRouter.delete("/raffle/delete-prize", jwt_1.decodeExt, jwt_1.ensureAdmin, raffle_controller_1.default.deletePrize);
raffleDrawRouter.put("/raffle/suspend-raffle-draw", jwt_1.decodeExt, jwt_1.ensureAdmin, raffle_controller_1.default.suspendRaffleDraw);
raffleDrawRouter.get("/raffle/get-active-raffledraw", jwt_1.decodeExt, raffle_controller_1.default.getActiveRaffleDraw);
raffleDrawRouter.get("/raffle/fetch-raffle-draws", jwt_1.decodeExt, 
// ensureAdmin,
raffle_controller_1.default.fetchRaffleDraws);
raffleDrawRouter.post("/raffle/check-tickets-availability", raffle_controller_1.default.checkTicketAvailability);
raffleDrawRouter.get("/raffle/close-raffledraw", raffle_controller_1.default.closeRaffleDraw);
raffleDrawRouter.post("/raffle/search-ticket-wins", raffle_controller_1.default.searchWinningEntriesTickets);
raffleDrawRouter.post("/raffle/change-raffle-banner", jwt_1.decode, jwt_1.ensureAdmin, (0, uploads_1.getMulterConfigSingle)("./public/raffledraws/"), raffle_controller_1.default.uploadRaffleDrawBanner);
exports.default = raffleDrawRouter;
