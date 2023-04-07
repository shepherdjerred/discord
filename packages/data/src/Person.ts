import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Karma } from "./Karma.js";

@Entity()
export class Person {
  @PrimaryColumn("int")
  id!: number;

  @Column("int")
  karma!: number;

  @OneToMany(() => Karma, (karma: Karma) => karma.giver)
  given!: Karma[];

  @OneToMany(() => Karma, (karma: Karma) => karma.receiver)
  received!: Karma[];
}
