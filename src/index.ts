import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import MainRouter from "./router";
import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: `*`,
    credentials: true,
    methods: ["POST", "GET", "DELETE", "PUT"],
    maxAge: 10000000,
    preflightContinue: true,
  })
);
app.use(cookieParser());
app.use(
  fileUpload({
    limits: { fileSize: 1024 * 1024 * 10 },
  })
);
app.use("/api/v1", MainRouter);
app.use(express.static("docs"));

app.get("/docs", (req: Request, res: Response) => {
  fs.readFile(__dirname + "/docs/index.html", "utf8", function (err, text) {
    res.send(text);
  });
});

try {
  prisma.$connect().then(() => {
    console.log("DB connected!");
  });
  app.listen(port, () => {
    console.log(`Server start on port=${port}`);
  });
} catch (err) {
  console.log(err);
}
