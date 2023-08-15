import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import metadataRoutes from "../src/metadataRoutes";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(bodyParser.json());

const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DATABASE_PASSWORD}@cluster0.kswfdml.mongodb.net/nft_uri?retryWrites=true&w=majority`;

// Connect to your MongoDB instance
mongoose
  .connect(DB_URI || "")
  .then(() => {
    console.log("Mongodb Connection successful");
  })
  .catch((err: any) => {
    console.log("Mongo connection error ", err);
  });

const port = process.env.PORT || 8000;

app.use("/api", metadataRoutes);

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
