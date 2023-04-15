import express from "express";
import type { Request, Response } from "express";
import configuration from "../configuration.js";

const app = express();

app.get("/", function (_: Request, res: Response) {
  res.send("Hey there :)");
});

app.use(express.static(configuration.dataDir));
app.listen(8080);
