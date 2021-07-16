import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User, UserProps} from "./user.models";

export interface MessageProps {
    content: string;
    readed: boolean;
    sender: User;
    receiver: User;
}

@Entity()
export class Message implements MessageProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    content!: string;

    @Column({type: "boolean",nullable: false})
    readed!: boolean;

    @ManyToOne(() => User, user => user.messageSended, {onDelete: 'CASCADE', nullable: false})
    sender: User;

    @ManyToOne(() => User, user => user.messageReceived, {onDelete: 'CASCADE', nullable: false})
    receiver: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
