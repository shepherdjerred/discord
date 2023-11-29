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
} from "@glitter-boys/data";
import configuration from "../configuration.ts";

export const dataSource = new DataSource({
  type: "sqlite",
  database: `${configuration.dataDir}/glitter.sqlite`,
  synchronize: true,
  logging: true,
  entities: [Karma, Person, KarmaGiven, KarmaReceived, KarmaCounts],
  subscribers: [],
  migrations: [],
  driver: sqlite3,
});

await dataSource.initialize();
