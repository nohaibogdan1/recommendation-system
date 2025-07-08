import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import User from "../users/user.entity";

@Entity("emailVerificationTokens")
export default class EmailVerificationToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  token: string;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.emailVerificationToken)
  user: User;
}
