// required for type orm
import "npm:reflect-metadata@0.1.13";
import sqlite3 from "./shim/index.ts";
import { DataSource } from "npm:typeorm@0.3.14";
import {
  Karma,
  KarmaCounts,
  KarmaGiven,
  KarmaReceived,
  Person,
} from "./karma/index.ts";
import configuration from "../configuration.ts";

export const dataSource = new DataSource({
  type: "sqlite",
  database: `${configuration.dataDir}/glitter.sqlite`,
  synchronize: true,
  logging: true,
  entities: [Karma, Person, KarmaGiven, KarmaReceived, KarmaCounts],
});

await dataSource.initialize();
