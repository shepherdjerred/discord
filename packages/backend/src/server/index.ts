import express from "https://esm.sh/express";
import type { Request, Response } from "https://esm.sh/express";
import configuration from "../configuration.ts";
import cors from "https://esm.sh/cors";

const app = express();
const port = process.env["PORT"] || 8000;

app.use(cors());
app.get("/", function (_: Request, res: Response) {
  res.send("Hey there :)");
});

app.use(express.static(configuration.dataDir));
app.listen(port);
