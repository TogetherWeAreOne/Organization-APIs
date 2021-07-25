import {User} from "./user.models";
import "reflect-metadata";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    UpdateDateColumn
} from "typeorm";

export interface UserBlockedUserProps {
    blockerUser: User;
    blockedUser: User;
    blockDate: string;
}

@Entity()
export class UserBlockedUser implements UserBlockedUserProps {

    @ManyToOne(() => User, user => user.usersBlocked, {primary :true, onDelete: 'CASCADE', nullable: false})
    blockerUser: User;

    @ManyToOne(() => User, user => user.blockedByUsers, {primary :true, onDelete: 'CASCADE', nullable: false})
    blockedUser: User;

    @Column({type: "date",nullable: false})
    blockDate!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
