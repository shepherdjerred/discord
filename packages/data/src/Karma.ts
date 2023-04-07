import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Person } from "./Person.js";

@Entity()
export class Karma {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Person, (person: Person) => person.received)
  receiver!: number;

  @ManyToOne(() => Person, (person: Person) => person.given)
  giver!: number;

  @Column("int")
  amount!: number;

  @Column("datetime")
  datetime!: Date;

  @Column()
  reason!: string;
}
