import { DataSource } from "typeorm";
import { Karma, Person } from "@glitter-boys/data";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "test",
  synchronize: true,
  logging: true,
  entities: [Karma, Person],
  subscribers: [],
  migrations: [],
});
