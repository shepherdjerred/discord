import {
  Entity,
  PrimaryColumn,
  OneToMany,
  type Relation,
} from "npm:typeorm@0.3.14";
import { Karma } from "./Karma.ts";

@Entity()
export class Person {
  @PrimaryColumn()
  id!: string;

  @OneToMany(() => Karma, (karma: Karma) => karma.giver)
  given!: Relation<Karma[]>;

  @OneToMany(() => Karma, (karma: Karma) => karma.receiver)
  received!: Relation<Karma[]>;
}
