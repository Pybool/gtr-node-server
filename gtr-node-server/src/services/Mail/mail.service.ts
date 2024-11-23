import ejs from "ejs";
import sendMail from "./mailtrigger.service";
const juice = require("juice");
let env = process.env.NODE_ENV;
let path = "dist/";
if (env == "dev") {
  path = "src/";
}
const mailActions = {
  auth: {
    sendEmailConfirmationOtp: async (email: string, otp: string) => {
      return new Promise(async (resolve, reject) => {
        try {
          const template = await ejs.renderFile(
            `${path}templates/emailConfirmation.ejs`,
            { email, otp }
          );

          const mailOptions = {
            from: process.env.GHANATALKSRADIO_EMAIL_HOST_USER,
            to: email,
            subject: "Email Verification",
            text: `Use the otp in this mail to complete your account onboarding`,
            html: template,
          };
          await sendMail(mailOptions);
          resolve({ status: true });
        } catch (error) {
          console.log(error);
          resolve({ status: false });
        }
      }).catch((error: any) => {
        console.log(error);
        throw error;
      });
    },

  },

  orders:{
    sendOrderSuccessfulMail: async (email:string, checkOutId:string)=>{
      return new Promise(async (resolve, reject) => {
        try {
          const template = await ejs.renderFile(
            `${path}templates/orderUpdate.ejs`,
            { email, checkOutId }
          );

          const mailOptions = {
            from: process.env.GHANATALKSRADIO_EMAIL_HOST_USER,
            to: email,
            subject: "Order Placed",
            text: `You have just placed an order with us`,
            html: template,
          };
          await sendMail(mailOptions);
          resolve({ status: true });
        } catch (error) {
          console.log(error);
          resolve({ status: false });
        }
      }).catch((error: any) => {
        console.log(error);
        throw error;
      });
    },
    sendReceiptMail: async (email:string, metaData:any, contestCode:string)=>{
      return new Promise(async (resolve, reject) => {
        try {
          const template = await ejs.renderFile(
            `${path}templates/receipt.ejs`,
            { email, metaData, contestCode }
          );

          const mailOptions = {
            from: process.env.GHANATALKSRADIO_EMAIL_HOST_USER,
            to: email,
            subject: "GTR Raffle Draw Tickets Receipt",
            text: `You bought tickets for raffle draw ${contestCode}`,
            html: juice(template),
          };
          await sendMail(mailOptions);
          resolve({ status: true });
        } catch (error) {
          console.log(error);
          resolve({ status: false });
        }
      }).catch((error: any) => {
        console.log(error);
      });
    },

    sendRaffleCongratsMail: async (email:string, metaData:any, contestCode:string)=>{
      return new Promise(async (resolve, reject) => {
        try {
          const template = await ejs.renderFile(
            `${path}templates/winner.ejs`,
            { email, metaData, contestCode }
          );

          const mailOptions = {
            from: process.env.GHANATALKSRADIO_EMAIL_HOST_USER,
            to: email,
            subject: "GTR Raffle Draw Lucky Winner!",
            text: `You are a lucky winner`,
            html: juice(template),
          };
          await sendMail(mailOptions);
          resolve({ status: true });
        } catch (error) {
          console.log(error);
          resolve({ status: false });
        }
      }).catch((error: any) => {
        console.log(error);
      });
    },
  }
  
};

export default mailActions;
