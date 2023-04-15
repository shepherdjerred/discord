// required for type orm
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Karma, KarmaCounts, KarmaGiven, KarmaReceived, Person } from "@glitter-boys/data";
import configuration from "../configuration.js";

export const dataSource = new DataSource({
  type: "sqlite",
  database: `${configuration.dataDir}/glitter.sqlite`,
  synchronize: true,
  logging: true,
  entities: [Karma, Person, KarmaGiven, KarmaReceived, KarmaCounts],
  subscribers: [],
  migrations: [],
});

await dataSource.initialize();
