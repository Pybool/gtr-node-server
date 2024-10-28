import mongoose from "mongoose";
import { handleErrors } from "../../bootstrap/global.error.handler";
import Xrequest from "../../interfaces/extensions.interface";
import RaffleEntry from "../../models/Raffle/raffleEntries.model";
import RaffleDraw from "../../models/Raffle/raffle.model";
import mailActions from "../Mail/mail.service";
import { config as dotenvConfig } from "dotenv";
import { SmsService } from "../Auth/termii.service";
dotenvConfig({ path: `.env.${process.env.NODE_ENV}` });
const API_KEY = process.env.TERMII_API_KEY;

export class RaffleEntryService {
  @handleErrors()
  public static async createRaffleEntry(req: Xrequest, raffleData: any) {
    let newEntry: any = null;
  
    const activeRaffleDraw = await RaffleDraw.findOne({ isActive: true });

    const ticketAvailableResult =
      await RaffleEntryService.checkTicketAvailability(raffleData.qty);
    if (!ticketAvailableResult.status) {
      return ticketAvailableResult;
    }
    if (activeRaffleDraw) {
      raffleData.raffleDraw = activeRaffleDraw?._id;
    }
    if (!req.accountId) {
      newEntry = await RaffleEntry.createRaffleEntry(
        req,
        new mongoose.Types.ObjectId(req.accountId),
        raffleData.phone,
        raffleData.raffleDraw,
        raffleData.qty
      );
    } else {
      newEntry = await RaffleEntry.createRaffleEntry(
        req,
        new mongoose.Types.ObjectId(req.accountId),
        raffleData.phone,
        raffleData.raffleDraw,
        raffleData.qty
      );
    }
    if (newEntry) {
      if (activeRaffleDraw) {
        activeRaffleDraw.ticketSold += newEntry.purchasedTickets;
        await activeRaffleDraw.save();
      }
      console.log("Raffle entry created:", newEntry);
      if (req.account.email) {
        mailActions.orders.sendReceiptMail(
          req.account.email,
          newEntry,
          activeRaffleDraw?.contestCode!
        );
      } else {
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
          SmsService.sendSms(
            "TICKETS",
            {
              contestCode: activeRaffleDraw?.contestCode!,
              tickets: newEntry.ticketNumbers.toString(),
            },
            data
          );
        }
      }

      return {
        status: true,
        message: "Raffle entry created:",
        data: newEntry,
        code: 200,
      };
    } else {
      return {
        status: false,
        message: "Raffle entry could not be created:",
        data: null,
        code: 200,
      };
    }
  }

  public static async checkTicketAvailability(qty: number) {
    const activeRaffleDraw = await RaffleDraw.findOne({ isActive: true });

    if (activeRaffleDraw) {
      const availableTickets =
        activeRaffleDraw.maxEntries - activeRaffleDraw.ticketSold;
      if (availableTickets < qty) {
        return {
          status: false,
          message: `There are only ${availableTickets} tickets left`,
          code: 200,
        };
      } else {
        return {
          status: true,
          message: `Requested ticket quantity is available`,
          code: 200,
        };
      }
    } else {
      return {
        status: false,
        message: "No active raffle draw at the moment , please try again later",
        code: 200,
      };
    }
  }
}
