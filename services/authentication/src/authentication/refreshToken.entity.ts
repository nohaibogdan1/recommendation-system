import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "../users/user.entity";

@Entity("refreshTokens")
export default class RefreshToken {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column()
    token: string;

    @ManyToOne(() => User, user=>user.refreshTokens)
    @JoinColumn()
    user: User;
}