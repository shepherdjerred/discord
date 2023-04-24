// required for type orm
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Karma, KarmaCounts, KarmaGiven, KarmaReceived, Person } from "@glitter-boys/data";
import initSqlJs from "sql.js";

const data = await fetch("https://prod.glitter-boys.com/glitter.sqlite").then((res) => res.arrayBuffer());

const SQL = await initSqlJs({
  // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
  // You can omit locateFile completely when running in node
  locateFile: (file) => `https://sql.js.org/dist/${file}`,
});

export const dataSource = new DataSource({
  type: "sqljs",
  database: new Uint8Array(data),
  driver: SQL,
  synchronize: true,
  logging: true,
  entities: [Karma, Person, KarmaGiven, KarmaReceived, KarmaCounts],
  subscribers: [],
  migrations: [],
});

await dataSource.initialize();
