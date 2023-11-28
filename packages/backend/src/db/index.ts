// required for type orm
import "https://esm.sh/reflect-metadata";
import { DataSource } from "npm:typeorm";
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
});

await dataSource.initialize();
