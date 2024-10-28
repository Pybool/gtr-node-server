import { handleErrors } from "../../bootstrap/global.error.handler";
import Xrequest from "../../interfaces/extensions.interface";
import Prizes from "../../models/Raffle/prizes.model";
import RaffleDraw, { IRaffleDraw } from "../../models/Raffle/raffle.model";
import RaffleEntry from "../../models/Raffle/raffleEntries.model";

export class RaffleDrawService {
  @handleErrors()
  public static async createRaffleDraw(req: Xrequest) {
    const requestBody = req.body;
    const payload: IRaffleDraw = requestBody;
    payload.createdAt = new Date();
    const flatPrizes = [];
    for (let prize of payload.prizes) {
      flatPrizes.push(prize.id);
    }
    payload.prizes = flatPrizes;
    payload.isActive = true;
    payload.contestCode = await RaffleDrawService.generateContestCode();
    await RaffleDraw.updateMany(
      {},
      { $set: { isActive: false } } //When a new draw is created disable all other draws
    );
    if (payload.useCompetitionDetailsAsDefault) {
      await RaffleDraw.updateMany(
        {},
        { $set: { useCompetitionDetailsAsDefault: false } } //When a new draw is created disable all other draws
      );
    }
    const raffleDraw = await RaffleDraw.create(payload);
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

  @handleErrors()
  public static async uploadRaffleDrawBanner(req: Xrequest) {
    try {
      const attachments = req.attachments;
      const requestBody = req.body;
      const raffleDrawId = requestBody.raffleDrawId;
      console.log(
        "raffleDrawId ",
        raffleDrawId,
        req.accountId,
        req.attachments,
        attachments
      );

      let raffleDraw = await RaffleDraw.findOne({
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
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  @handleErrors()
  public static async activateRaffleDraw(req: Xrequest) {
    return {
      status: true,
      message: "",
      code: 200,
    };
  }

  @handleErrors()
  public static async destroyRaffleDraw(req: Xrequest) {
    return {
      status: true,
      message: "",
      code: 200,
    };
  }

  @handleErrors()
  public static async createPrize(req: Xrequest) {
    const requestBody = req.body;
    console.log(req.attachments);
    const payload: any = JSON.parse(requestBody.data);

    let prizeAttachments = req.attachments!;

    if (
      prizeAttachments.length == 0 ||
      req.files.length != prizeAttachments.length
    ) {
      return {
        status: false,
        message: "Prize creation failed, no valid images were sent",
        data: null,
        code: 422,
      };
    }
    payload.image = prizeAttachments[0]?.url;
    payload.createdAt = new Date();
    const prize = await Prizes.create(payload);

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

  @handleErrors()
  public static async getActiveRaffleDraw() {
    const activeRaffleDraw = await RaffleDraw.findOne({
      isActive: true,
    }).populate("prizes");
    if (activeRaffleDraw) {
      if (activeRaffleDraw.competitionDetails.length == 0) {
        activeRaffleDraw.competitionDetails =
          await RaffleDrawService.getDefaultCompetitionDetails()!;
      }
    }
    return {
      status: true,
      message: "Raffle Draw has been fetched succesfully.",
      data: activeRaffleDraw,
      code: 200,
    };
  }

  @handleErrors()
  public static async getPrizes() {
    const prizes = await Prizes.find();
    return {
      status: true,
      message: "Prize has been fetched succesfully.",
      data: prizes,
      code: 200,
    };
  }

  @handleErrors()
  public static async fetchRaffleDraws(req: Xrequest) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const activeRaffleDraw = await RaffleDraw.find()
      .sort({ createdAt: -1 })
      .populate("prizes")
      .skip(skip)
      .limit(limit);

    const totalDocuments = await RaffleDraw.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    return {
      status: true,
      message: "Raffle Draws have been fetched successfully.",
      data: activeRaffleDraw,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        limit: limit,
        totalDocuments: totalDocuments,
      },
      code: 200,
    };
  }

  @handleErrors()
  public static async closeRaffleDraw() {
    const activeRaffleResult = await RaffleDrawService.getActiveRaffleDraw();
    if (activeRaffleResult.status) {
      const activeRaffleDraw = activeRaffleResult.data!;
      if (activeRaffleDraw!?.isTerminated) {
        return {
          status: false,
          message: "Cannot close an already terminated raffle draw",
          code: 400,
        };
      }
      activeRaffleDraw.isActive = false;
      activeRaffleDraw.raffleEndDate = new Date();
      // await activeRaffleDraw.save()
      const winnersResult = await RaffleDrawService.selectRaffleDrawWinners(
        activeRaffleDraw._id!?.toString(),
        activeRaffleDraw.maxWinners
      );
      const winningTickets = winnersResult.data;
      activeRaffleDraw.winningTickets = winningTickets;
      activeRaffleDraw.isTerminated = true;
      await activeRaffleDraw.save();
      return {
        status: true,
        message: "Raffle draw has been closed and winners selected",
        data: activeRaffleDraw,
        code: 200,
      };
    }
  }

  @handleErrors()
  public static async selectRaffleDrawWinners(
    raffleDrawId: string,
    winnersCount: number
  ) {
    const randomTickets = await RaffleEntry.selectRandomTickets(
      raffleDrawId,
      winnersCount
    );
    return {
      status: true,
      data: randomTickets,
    };
  }

  @handleErrors()
  public static async searchWinningEntriesTickets(req: Xrequest) {
    const contestCode: string = req.body.contestCode!;
    const tickets: number[] = req.body.tickets;
    const winners =
      (await RaffleEntry.findWinningTickets(contestCode, tickets)) || [];
    const found = [];
    const winningTickets = winners[0].raffleDraw.winningTickets;
    for (let _test_ticket of tickets) {
      if (winningTickets.includes(_test_ticket)) {
        found.push(_test_ticket);
      }
    }
    let msg = "No wining tickets were found for the tickets you provided";
    if (winners.length > 0) {
      msg = `These are winning ticket(s) on this raffle draw: ${found.toString()?.trim().replaceAll(","," , ")}`;
    }
    return {
      status: true,
      message: msg,
      data: winners,
      code: 200,
    };
  }

  @handleErrors()
  private static async generateContestCode(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // Last two digits of the year
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Two-digit month
    const day = date.getDate().toString().padStart(2, "0"); // Two-digit day

    let contestCode = `GTR-${year}${month}${day}`;
    const exists = await RaffleDraw.findOne({ contestCode });
    if (exists) {
      return contestCode + `${Math.floor(Date.now() / 1000)}`;
    }
    return contestCode;
  }

  @handleErrors()
  private static async getDefaultCompetitionDetails() {
    const competitionWithDefault = await RaffleDraw.findOne({
      useCompetitionDetailsAsDefault: true,
    });
    return competitionWithDefault?.competitionDetails!;
  }
}
