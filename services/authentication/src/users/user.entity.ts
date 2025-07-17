import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import EmailVerificationToken from "../authentication/emailVerificationToken.entity";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ default: false })
  emailVerified: boolean;

  @OneToOne(() => EmailVerificationToken, emailVerificationToken => emailVerificationToken.user)
  emailVerificationToken: EmailVerificationToken
}
