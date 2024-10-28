import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Xrequest from "../interfaces/extensions.interface";
import Accounts from "../models/Accounts/accounts.model";

const SECRET_KEY: string = process.env.GHANATALKSRADIO_ACCESS_TOKEN_SECRET || "";

export const decode = async (req: Xrequest, res: Response, next: any) => {
  const reqHeaders: any = req.headers;
  if (!reqHeaders["authorization"]) {
    return res
      .status(400)
      .json({ success: false, message: "No access token provided" });
  }

  const accessToken = reqHeaders.authorization.split(" ")[1];
  try {
    console.log("JWT ", accessToken)
    const decoded: any = jwt.verify(accessToken, SECRET_KEY);
    req.accountId = decoded.aud;
    req.account = await Accounts.findOne({ _id: req.accountId });
    if(!req.account.active){
      throw new Error("Account is de-activated")
    }
    return next();
  } catch (error: any) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export const decodeExt = async (req: Xrequest, res: Response, next: any) => {
  const reqHeaders: any = req.headers;
  if (!reqHeaders["authorization"]) {
    return next();
  }

  const accessToken = reqHeaders.authorization.split(" ")[1];
  try {
    const decoded: any = jwt.verify(accessToken, SECRET_KEY);
    req.accountId = decoded.aud;
    req.account = await Accounts.findOne({ _id: req.accountId });
    if(!req.account.active){
      throw new Error("Account is de-activated")
    }
    return next();
  } catch (error: any) {
    console.log(error)
    return next();
  }
};

export function ensureAdmin(req: Xrequest, res: Response, next: NextFunction) {
  try {
    const account = req.account;
    if(!account.active){
      throw new Error("Account is de-activated")
    }
    if (account && account.role === "ADMIN") {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Account is not an admin" });
    }
  } catch (error: any) {
    return next();
  }
}
