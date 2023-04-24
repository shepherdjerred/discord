// required for type orm
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Karma, KarmaCounts, KarmaGiven, KarmaReceived, Person } from "@glitter-boys/data";
import "sql.js";

const data = await fetch("https://prod.glitter-boys.com/glitter.sqlite").then((res) => res.arrayBuffer());

export const dataSource = new DataSource({
  type: "sqljs",
  database: new Uint8Array(data),
  synchronize: true,
  logging: true,
  entities: [Karma, Person, KarmaGiven, KarmaReceived, KarmaCounts],
  subscribers: [],
  migrations: [],
});

await dataSource.initialize();
