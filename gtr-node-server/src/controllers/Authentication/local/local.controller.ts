import { NextFunction, Response } from "express";
import { Authentication } from "../../../services/Auth/authentication.local.service";
import Xrequest from "../../../interfaces/extensions.interface";
import message from "../../../helpers/messages";

const authController: any = {
    createAccount: async (req: Xrequest, res: Response, next: NextFunction) => {
      let status = 200;
      try {
        const authentication = new Authentication(req);
        const result = await authentication.createAccount();
        if (result.status) {
          status = 201;
          res.status(status).json(result);
        } else {
          console.log("result ", result);
          return res.status(200).json(result);
        }
      } catch (error: any) {
        console.log("Auth error ", error.message);
        if (error.isJoi === true) {
          error.status = 422;
        }
        res.status(status).json({ status: false, message: error?.message });
      }
    },

    acceptedTerms: async (req: Xrequest, res: Response, next: NextFunction) => {
      let status = 200;
      try {
        const authentication = new Authentication(req);
        const result = await authentication.acceptedTerms(req);
        if (result.status) {
          status = 201;
          res.status(status).json(result);
        } else {
          return res.status(200).json(result);
        }
      } catch (error: any) {
        res.status(status).json({ status: false, message: error?.message });
      }
    },

    phoneLogin: async (req: Xrequest, res: Response, next: NextFunction) => {
      let status = 200;
      try {
        const authentication = new Authentication(req);
        const result = await authentication.phoneLogin();
        if (result.status) {
          status = 200;
          res.status(status).json(result);
        } else {
          console.log("result ", result);
          return res.status(200).json(result);
        }
      } catch (error: any) {
        console.log("Auth error ", error.message);
        if (error.isJoi === true) {
          error.status = 422;
        }
        res.status(status).json({ status: false, message: error?.message });
      }
    },

    emailLogin: async (req: Xrequest, res: Response, next: NextFunction) => {
      let status = 200;
      try {
        const authentication = new Authentication(req);
        const result = await authentication.emailLogin();
        if (result.status) {
          status = 200;
          res.status(status).json(result);
        } else {
          console.log("result ", result);
          return res.status(200).json(result);
        }
      } catch (error: any) {
        console.log("Auth error ", error.message);
        if (error.isJoi === true) {
          error.status = 422;
        }
        res.status(status).json({ status: false, message: error?.message });
      }
    },

    sendPhoneOtp: async (req: Xrequest, res: Response, next: NextFunction) => {
      let status = 200;
      try {
        const authentication = new Authentication(req);
        const messageType = req.body.messageType!;
        const result = await authentication.sendPhoneOtp(messageType);
        if (result.status) {
          status = 201;
          res.status(status).json(result);
        } else {
          console.log("result ", result);
          return res.status(200).json(result);
        }
      } catch (error: any) {
        console.log("Auth error ", error.message);
        if (error.isJoi === true) {
          error.status = 422;
        }
        res.status(status).json({ status: false, message: error?.message });
      }
    },

    sendEmailOtp: async (req: Xrequest, res: Response, next: NextFunction) => {
      let status = 200;
      try {
        const authentication = new Authentication(req);
        const messageType = req.body.messageType!;
        const result = await authentication.sendEmailOtp(messageType);
        if (result.status) {
          status = 201;
          res.status(status).json(result);
        } else {
          console.log("result ", result);
          return res.status(200).json(result);
        }
      } catch (error: any) {
        console.log("Auth error ", error.message);
        if (error.isJoi === true) {
          error.status = 422;
        }
        res.status(status).json({ status: false, message: error?.message });
      }
    },
  
    verifyAccountEmail: async (req: Xrequest, res: Response, next: NextFunction) => {
      try {
        let status = 400;
        const authentication = new Authentication(req);
        const result = await authentication.verifyAccountEmail();
        if (result.status) status = 200;
        res.status(status).json(result);
      } catch (error: any) {
        error.status = 422;
        next(error);
      }
    },
  
    getRefreshToken: async (req: Xrequest, res: Response, next: NextFunction) => {
      try {
        let status = 400;
        const authentication = new Authentication(req);
        if (req.body.refreshToken == "") {
          res.status(200).json({ status: false });
        }
        const result = await authentication.getRefreshToken(next);
        if (result) status = 200;
        res.status(status).json(result);
      } catch (error: any) {
        error.status = 422;
        next(error);
      }
    },
  };

export default authController;
