"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const metadataRoutes_1 = __importDefault(require("./metadataRoutes"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
const corsOptions = {
    origin: "*",
};
app.use((0, cors_1.default)(corsOptions));
app.options("*", (0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DATABASE_PASSWORD}@cluster0.kswfdml.mongodb.net/nft_uri?retryWrites=true&w=majority`;
// Connect to your MongoDB instance
mongoose_1.default
    .connect(DB_URI || "")
    .then(() => {
    console.log("Mongodb Connection successful");
})
    .catch((err) => {
    console.log("Mongo connection error ", err);
});
const port = process.env.PORT;
app.use("/api", metadataRoutes_1.default);
app.all("*", (req, res, next) => {
    next(new Error(`Can't find ${req.originalUrl} on this server`));
});
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    res.status(500).json({
        message: err.message,
    });
});
process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("UNCAUGHT EXCEPTION!, SHUTTING DOWN");
    process.exit(1);
});
const server = app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});
process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("UNHANDLED REJECTION!, SHUTTING DOWN");
    server.close(() => {
        process.exit(1);
    });
});
exports.default = server;
