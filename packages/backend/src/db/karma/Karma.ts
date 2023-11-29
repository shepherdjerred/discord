import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  type Relation,
} from "npm:typeorm@0.3.14";
import { Person } from "./Person.ts";

@Entity()
export class Karma {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Person, (person: Person) => person.received)
  receiver!: Relation<Person>;

  @ManyToOne(() => Person, (person: Person) => person.given)
  giver!: Relation<Person>;

  @Column("int")
  amount!: number;

  @Column("datetime")
  datetime!: Date;

  @Column({ type: "text", nullable: true })
  reason!: string | undefined;
}
