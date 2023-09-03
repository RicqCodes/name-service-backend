import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import "dotenv/config";
import routes from "./routes";
import bodyParser from "body-parser";

const app = express();
app.enable("trust proxy");
app.use(bodyParser.urlencoded({ extended: false }));

// Define an array of allowed origins
const allowedOrigins = [
  "https://baseid.netlify.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://192.168.149.171:5173/",
  "https://api.opensea.io",
  "https://testnets-api.opensea.io",
  "http://localhost:9000",
];

app.use(
  cors({
    origin: "*",
  })
);

// Array of whitelisted URLs
const whitelist = ["/api/v1/metadata/"];

// Apply rate limiting to all routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max requests per window
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use((req, res, next) => {
  const { origin } = req.headers;
  const path = req.path;

  // Check if the origin is allowed and path is allowed
  if (allowedOrigins.includes(origin!)) {
    if (path.includes("/api/v1/walletid")) {
      // Allow access to the /metadata endpoint for both
      res.setHeader("Access-Control-Allow-Origin", origin!);
      res.setHeader("Access-Control-Allow-Methods", "GET");
      next();
    } else if (
      path.includes("/api/v1/user-domains") &&
      (origin === "https://baseid.netlify.app" ||
        origin === "https://app.baseId.domains" ||
        origin === "http://127.0.0.1:5173" ||
        origin === "http://192.168.149.171:5173/")
    ) {
      // Allow access to the /user-domains endpoint only for your app
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Methods", "GET");
      next();
    } else {
      // Block access for any other combination
      res.status(403).send("Access denied");
    }
  } else {
    // Block access for non-whitelisted origins
    res.status(403).send("Access denied");
  }
});

// Rate limiting middleware
app.use((req, res, next) => {
  // Check if the requested URL is in the whitelist
  if (whitelist.includes(req.path)) {
    return next(); // Allow whitelisted URLs to bypass rate limiting
  }
  limiter(req, res, next); // Apply rate limiting to other requests
});

app.use(bodyParser.json());

const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DATABASE_PASSWORD}@cluster0.kswfdml.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;

// Connect to your MongoDB instance
mongoose
  .connect(DB_URI || "")
  .then(() => {
    console.log("Mongodb Connection successful");
  })
  .catch((err: any) => {
    console.log("Mongo connection error ", err);
  });

const port = process.env.PORT || 9000;

app.use("/api/v1", routes);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new Error(`Can't find ${req.originalUrl} on this server`));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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

process.on("unhandledRejection", (err: any) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION!, SHUTTING DOWN");
  server.close(() => {
    process.exit(1);
  });
});

// export default serverless(app);
