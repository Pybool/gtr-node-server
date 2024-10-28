import { NextFunction, Response } from "express";
import { RaffleDrawService } from "../../services/Raffle/raffle.service";
import Xrequest from "../../interfaces/extensions.interface";
import { RaffleEntryService } from "../../services/Raffle/rafflentries.service";

const raffleDrawController:any = {
  createRaffleDraw: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await RaffleDrawService.createRaffleDraw(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  activateRaffleDraw: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await RaffleDrawService.activateRaffleDraw(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  destroyRaffleDraw: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await RaffleDrawService.destroyRaffleDraw(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  createPrize:async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await RaffleDrawService.createPrize(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  getPrizes:async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await RaffleDrawService.getPrizes();
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  getActiveRaffleDraw:async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await RaffleDrawService.getActiveRaffleDraw();
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  checkTicketAvailability:async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const qty:number = req.body.qty!;
      const result = await RaffleEntryService.checkTicketAvailability(qty);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  fetchRaffleDraws:async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await RaffleDrawService.fetchRaffleDraws(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  closeRaffleDraw:async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await RaffleDrawService.closeRaffleDraw();
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  searchWinningEntriesTickets:async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await RaffleDrawService.searchWinningEntriesTickets(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  uploadRaffleDrawBanner: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await RaffleDrawService.uploadRaffleDrawBanner(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },
};


export default raffleDrawController;