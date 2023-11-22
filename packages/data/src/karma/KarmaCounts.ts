import { ViewColumn, DataSource, ViewEntity } from "typeorm";
import { Person } from "./Person.js";
import { KarmaGiven } from "./KarmaGiven.js";
import { KarmaReceived } from "./KarmaReceived.js";

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select("person.id", "id")
      .addSelect("received.karmaReceived", "karmaReceived")
      .addSelect("given.karmaGiven", "karmaGiven")
      .from(Person, "person")
      .leftJoin(KarmaGiven, "given", "given.id = person.id")
      .leftJoin(KarmaReceived, "received", "received.id= person.id"),
})
export class KarmaCounts {
  @ViewColumn()
  id!: string;

  @ViewColumn()
  karmaGiven!: number;

  @ViewColumn()
  karmaReceived!: number;
}
