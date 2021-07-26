import {Event} from "./event.models";
import {
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {EventParticipant} from "./eventParticipant.models";
import {User} from "./user.models";
import {Discussion} from "./discussion.models";
import "reflect-metadata";
export interface DiscussionMessageProps {
    content: string;
    user: User;
    discussion: Discussion;
}

@Entity()
export class DiscussionMessage implements DiscussionMessageProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    content!: string;

    @ManyToOne(() => User, user => user.discussionMessage, {onDelete: 'CASCADE', nullable: false})
    user: User;

    @ManyToOne(() => Discussion, discussion => discussion.discussionMessage, {onDelete: 'CASCADE', nullable: false})
    discussion: Discussion;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
