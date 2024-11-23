import { handleErrors } from "../../bootstrap/global.error.handler";
import logger from "../../bootstrap/logger";
import Xrequest from "../../interfaces/extensions.interface";
import Prizes from "../../models/Raffle/prizes.model";
import RaffleDraw, { IRaffleDraw } from "../../models/Raffle/raffle.model";
import RaffleEntry from "../../models/Raffle/raffleEntries.model";
import { SmsService } from "../Auth/termii.service";
import mailActions from "../Mail/mail.service";
import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: `.env.${process.env.NODE_ENV}` });
const API_KEY = process.env.TERMII_API_KEY;
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
  public static async getActiveRaffleDraw(req: Xrequest) {
    let userActiveRaffleTickets: any = [];
    const activeRaffleDraw = await RaffleDraw.findOne({
      isActive: true,
    }).populate("prizes");
    if (activeRaffleDraw) {
      if (activeRaffleDraw.competitionDetails.length == 0) {
        activeRaffleDraw.competitionDetails =
          await RaffleDrawService.getDefaultCompetitionDetails()!;
      }
      const accountId = req.accountId!;

      if (accountId) {
        console.log("Active User tickets ==> ", {
          userId: req.accountId!,
          raffleDraw: activeRaffleDraw._id,
        });
        userActiveRaffleTickets = await RaffleEntry.find({
          userId: accountId,
          raffleDraw: activeRaffleDraw._id,
        });
      } else {
        const phone = req.query.phone!;
        userActiveRaffleTickets = await RaffleEntry.find({
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
  public static async deletePrize(req: Xrequest) {
    const prizes = await Prizes.deleteOne({ _id: req.query.id! as string });
    return {
      status: true,
      message: "Prize has been deleted succesfully.",
      data: prizes,
      code: 200,
    };
  }

  @handleErrors()
  public static async suspendRaffleDraw(req: Xrequest) {
    const activeRaffleResult = await RaffleDrawService.getActiveRaffleDraw(req);
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

  @handleErrors()
  public static async fetchRaffleDraws(req: Xrequest) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const raffleDraws = await RaffleDraw.find()
      .sort({ createdAt: -1 })
      .populate("prizes")
      .skip(skip)
      .limit(limit);

    const totalDocuments = await RaffleDraw.countDocuments();
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

  @handleErrors()
  public static async closeRaffleDraw(req: Xrequest) {
    const activeRaffleResult = await RaffleDrawService.getActiveRaffleDraw(req);
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
      if (winnersResult) {
        console.log(" Winners data ", winnersResult.data);
        await RaffleDrawService.sendWinnersNotification(
          activeRaffleDraw,
          winnersResult.data
        );
      }
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
    //Send sms or emails to winners
    return {
      status: true,
      data: randomTickets,
    };
  }

  @handleErrors()
  public static async searchWinningEntriesTickets(req: Xrequest) {
    const userIdentity = req.accountId! || (req.body.phone! as string);
    const contestCode: string = req.body.contestCode!;
    const tickets: number[] = req.body.tickets;
    const winners =
      (await RaffleEntry.findWinningTickets(
        userIdentity,
        contestCode,
        tickets
      )) || [];
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

  @handleErrors()
  private static async sendWinnersNotification(
    raffleDraw: any,
    winningTickets: any[]
  ) {
    const contestCode: string = raffleDraw.contestCode;
    const winners: any = await RaffleEntry.aggregate([
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
        const validateEmail = (email: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        };

        if (validateEmail(email)) {
          mailActions.orders.sendRaffleCongratsMail(
            email,
            { ticketNumbers: winner.winningTickets, createdAt: new Date() },
            contestCode
          );
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
            SmsService.sendSms(
              "WIN",
              { contestCode, tickets: winner.winningTickets.join(",") },
              data
            );
            logger.info("Sms sent successfully")
          } catch {
            //Fail silently
            logger.info("Failed to send sms")
          }
        }
      }
    }
  }
}
