import express from "express";
import type { Request, Response } from "express";
import configuration from "../configuration.js";
import cors from "cors";

const app = express();
const port = process.env["PORT"] || 8080;

app.use(cors());
app.get("/", function (_: Request, res: Response) {
  res.send("Hey there :)");
});

app.use(express.static(configuration.dataDir));
app.listen(port);
