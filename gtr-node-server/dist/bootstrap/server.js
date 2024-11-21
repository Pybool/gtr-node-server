"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
require("../redis/init.redis");
require("./init.mongo");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const logger_1 = __importDefault(require("./logger"));
const _app_1 = __importDefault(require("./_app"));
const jwt_1 = require("../middlewares/jwt");
const session_1 = require("../middlewares/session");
const authentication_route_1 = __importDefault(require("../routes/authentication.route"));
const raffledraw_route_1 = __importDefault(require("../routes/raffledraw.route"));
const transactions_routes_1 = __importDefault(require("../routes/transactions.routes"));
(0, dotenv_1.config)();
(0, dotenv_1.config)({ path: `.env.${process.env.NODE_ENV}` });
const SERVER_URL = "0.0.0.0";
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
_app_1.default.use((0, cors_1.default)(corsOptions));
_app_1.default.use(express_1.default.json());
_app_1.default.use(session_1.sessionMiddleware);
_app_1.default.use(express_1.default.urlencoded({ extended: true }));
console.log("PUBLIC FOLDER ", process.env.GHANATALKSRADIO_PUBLIC_FOLDER);
_app_1.default.use(express_1.default.static(process.env.GHANATALKSRADIO_PUBLIC_FOLDER));
_app_1.default.use(express_1.default.static(process.env.GHANATALKSRADIO_PUBLIC_FOLDER2));
_app_1.default.get("/test", async (req, res) => {
    res.status(200).send("Hello from GHANATALKSRADIO Backend Server\n");
});
_app_1.default.get("/api/v1/paystack/get-public-key", jwt_1.decodeExt, async (req, res) => {
    try {
        const key = `GHANATALKSRADIO_${process.env.NODE_ENV.toUpperCase()}_PAYSTACK_PUBLIC_KEY`;
        return res.send({
            status: true,
            PUBLIC_KEY: process.env[key] || null,
        });
    }
    catch (error) {
        return res.send({
            status: false,
            PUBLIC_KEY: null,
        });
    }
});
_app_1.default.use("/api/v1/auth", authentication_route_1.default);
_app_1.default.use("/api/v1/admin", raffledraw_route_1.default);
_app_1.default.use("/api/v1/transactions", transactions_routes_1.default);
// app.post("/api/v1/get-chat-token", decodeExt, generateTokenForUser);
_app_1.default.use((err, req, res, next) => {
    console.error(err.stack);
    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof SyntaxError) {
        return res.status(400).json({ error: "Invalid JSON" });
    }
    res.status(500).json({ error: "Something went wrong 5xx" });
});
_app_1.default.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === "dev" ? err : {};
    res.status(err.status || 500);
    res.json({ message: "Something went wrong 5xx " + err });
});
if (!process.env.NODE_ENV) {
    process.exit(1);
}
_app_1.default.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
});
_app_1.default.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).json({ status: false, message: err.message });
    }
    else {
        next(err);
    }
});
_app_1.default.set("view engine", "ejs");
_app_1.default.set("views", "src/templates");
const server = http_1.default.createServer(_app_1.default);
const PORT = process.env.GHANATALKSRADIO_MAIN_SERVER_PORT || 8000;
let environment = "Development";
if (process.env.NODE_ENV === "prod") {
    environment = "Production";
}
function generateAsciiArt(text) {
    const length = text.length;
    const line = Array(length + 8)
        .fill("-")
        .join("");
    const emptyLine = "|" + " ".repeat(length + 6) + "|";
    return `
 ${line}
|  ${text}  |
|  😊 ${environment} Server started successfully.  |
|  🎧 Listening on port ${PORT}...  |
 ${line}
`;
}
server.listen(PORT, () => {
    const serverMessage = generateAsciiArt(`GHANATALKSRADIO ${environment} Server is running on ${SERVER_URL}:${PORT}`.toUpperCase());
    logger_1.default.info(serverMessage);
});
