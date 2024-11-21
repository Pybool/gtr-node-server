"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ejs_1 = __importDefault(require("ejs"));
const mailtrigger_service_1 = __importDefault(require("./mailtrigger.service"));
const juice = require("juice");
let env = process.env.NODE_ENV;
let path = "dist/";
if (env == "dev") {
    path = "src/";
}
const mailActions = {
    auth: {
        sendEmailConfirmationOtp: async (email, otp) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const template = await ejs_1.default.renderFile(`${path}templates/emailConfirmation.ejs`, { email, otp });
                    const mailOptions = {
                        from: process.env.GHANATALKSRADIO_EMAIL_HOST_USER,
                        to: email,
                        subject: "Email Verification",
                        text: `Use the otp in this mail to complete your account onboarding`,
                        html: template,
                    };
                    await (0, mailtrigger_service_1.default)(mailOptions);
                    resolve({ status: true });
                }
                catch (error) {
                    console.log(error);
                    resolve({ status: false });
                }
            }).catch((error) => {
                console.log(error);
                throw error;
            });
        },
    },
    orders: {
        sendOrderSuccessfulMail: async (email, checkOutId) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const template = await ejs_1.default.renderFile(`${path}templates/orderUpdate.ejs`, { email, checkOutId });
                    const mailOptions = {
                        from: process.env.GHANATALKSRADIO_EMAIL_HOST_USER,
                        to: email,
                        subject: "Order Placed",
                        text: `You have just placed an order with us`,
                        html: template,
                    };
                    await (0, mailtrigger_service_1.default)(mailOptions);
                    resolve({ status: true });
                }
                catch (error) {
                    console.log(error);
                    resolve({ status: false });
                }
            }).catch((error) => {
                console.log(error);
                throw error;
            });
        },
        sendReceiptMail: async (email, metaData, contestCode) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const template = await ejs_1.default.renderFile(`${path}templates/receipt.ejs`, { email, metaData, contestCode });
                    const mailOptions = {
                        from: process.env.GHANATALKSRADIO_EMAIL_HOST_USER,
                        to: email,
                        subject: "GTR Raffle Draw Tickets Receipt",
                        text: `You bough tickets for raffle draw ${contestCode}`,
                        html: juice(template),
                    };
                    await (0, mailtrigger_service_1.default)(mailOptions);
                    resolve({ status: true });
                }
                catch (error) {
                    console.log(error);
                    resolve({ status: false });
                }
            }).catch((error) => {
                console.log(error);
            });
        },
    }
};
exports.default = mailActions;
