import express from "express";
import { decode, decodeExt, ensureAdmin } from "../middlewares/jwt";
import { getMulterConfig, getMulterConfigSingle } from "../middlewares/uploads";
import raffleDrawController from "../controllers/Raffle/raffle.controller";
const raffleDrawRouter = express.Router();

raffleDrawRouter.post(
  "/raffle/create-event",
  decode,
  ensureAdmin,
  raffleDrawController.createRaffleDraw
);

raffleDrawRouter.post(
  "/raffle/create-prize",
  decode,
  ensureAdmin,
  getMulterConfig("./public/raffledraws/", "object"),
  raffleDrawController.createPrize
);

raffleDrawRouter.get(
  "/raffle/fetch-prizes",
  decodeExt,
  // ensureAdmin,
  raffleDrawController.getPrizes
);

raffleDrawRouter.get(
  "/raffle/get-active-raffledraw",
  decodeExt,
  raffleDrawController.getActiveRaffleDraw
);

raffleDrawRouter.get(
  "/raffle/fetch-raffle-draws",
  decodeExt,
  // ensureAdmin,
  raffleDrawController.fetchRaffleDraws
);

raffleDrawRouter.post(
  "/raffle/check-tickets-availability",
  raffleDrawController.checkTicketAvailability
);

raffleDrawRouter.get(
  "/raffle/close-raffledraw",
  raffleDrawController.closeRaffleDraw
);

raffleDrawRouter.post(
  "/raffle/search-ticket-wins",
  raffleDrawController.searchWinningEntriesTickets
);

raffleDrawRouter.post(
  "/raffle/change-raffle-banner",
  decode,
  ensureAdmin,
  getMulterConfigSingle("./public/raffledraws/"),
  raffleDrawController.uploadRaffleDrawBanner
);




export default raffleDrawRouter;