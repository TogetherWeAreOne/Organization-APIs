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
import {Event} from "./event.models";
import "reflect-metadata";
import {DiscussionUser} from "./discussionUser.models";


export interface DiscussionUserParticipantProps {
    user: User;
    discussion: DiscussionUser;
}

@Entity()
export class DiscussionUserParticipant implements DiscussionUserParticipantProps {

    @ManyToOne(() => User, user => user.eventParticipants, {primary : true, onDelete: 'CASCADE'})
    user: User;

    @ManyToOne(() => DiscussionUser, discussion => discussion.discussionUserParticipant, {primary : true, onDelete: 'CASCADE'})
    discussion: DiscussionUser;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
