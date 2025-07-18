import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import EmailVerificationToken from "../authentication/emailVerificationToken.entity";
import RefreshToken from "../authentication/refreshToken.entity";

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

  @Column({ default: false })
  emailVerified: boolean;

  @OneToOne(
    () => EmailVerificationToken,
    (emailVerificationToken) => emailVerificationToken.user
  )
  emailVerificationToken: EmailVerificationToken;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}
