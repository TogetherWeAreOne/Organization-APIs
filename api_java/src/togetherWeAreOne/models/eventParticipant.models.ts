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


export interface EventParticipantProps {
    user: User;
    event: Event;
    role: string;
}

enum EventParticipantRole {
    CREATOR = "CREATOR",
    PARTICIPANT = "PARTICIPANT"
}

@Entity()
export class EventParticipant implements EventParticipantProps {

    @ManyToOne(() => User, user => user.eventParticipants, {primary : true, onDelete: 'CASCADE'})
    user: User;

    @ManyToOne(() => Event, event => event.eventParticipants, {primary : true, onDelete: 'CASCADE'})
    event: Event;

    @Column({type: "enum", enum : EventParticipantRole, nullable: false})
    role!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
