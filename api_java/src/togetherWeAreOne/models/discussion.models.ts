import {
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./user.models";
import {EventParticipant} from "./eventParticipant.models";
import {Event, EventProps} from "./event.models";
import {DiscussionMessage} from "./discussionMessage.models";
import "reflect-metadata";

export interface DiscussionProps {
    title: string;
    lastMessageDate: Date;
    event: Event;

}

@Entity()
export class Discussion implements DiscussionProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    title!: string;

    @Column({nullable: true})
    lastMessageDate!: Date;

    @OneToMany(() => DiscussionMessage, discussionMessage => discussionMessage.discussion)
    discussionMessage: DiscussionMessage[];

    @ManyToOne(() => Event, event => event.discussion, {onDelete: 'CASCADE', nullable: false})
    event: Event;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
