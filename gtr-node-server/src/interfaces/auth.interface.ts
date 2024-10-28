import { RequestHandler } from "express";

export interface IAuth {
  createAccount: RequestHandler;
  sendEmailConfirmationOtp: RequestHandler;
  sendPasswordResetLink: RequestHandler;
  resetPassword: RequestHandler;
  verifyAccountEmail: RequestHandler;
  loginAccount: RequestHandler;
  getRefreshToken: RequestHandler;
  phoneRegister: RequestHandler;
  phoneLogin: RequestHandler;
  sendPhoneOtp: RequestHandler;
  sendEmailOtp: RequestHandler;
}
