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
import {Message} from "./message.models";
import {DiscussionUserParticipant} from "./discussionUserParticpant.models";

export interface DiscussionUserProps {
    lastMessageDate: Date;
}

@Entity()
export class DiscussionUser implements DiscussionUserProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: true})
    lastMessageDate!: Date;

    @OneToMany(() => Message, message => message.discussion)
    messages: Message[];

    @OneToMany(() => DiscussionUserParticipant, discussionParticipant => discussionParticipant.discussion)
    discussionUserParticipant: DiscussionUserParticipant[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
