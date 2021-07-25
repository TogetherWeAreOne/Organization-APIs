import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User, UserProps} from "./user.models";
import "reflect-metadata";
import {EventParticipant} from "./eventParticipant.models";


export interface EventProps {
    title: string;
    description: string;
    maxParticipant: number;
    minParticipant: number;
    image: string;
    address: string;
    zip: string;
    country: string;
    startDate: string;
    endDate: string;
    eventType: string;
    creator : User;
}

enum EventType {
    ECOLOGICAL = "ECOLOGICAL",
    HUMANITARIAN = "HUMANITARIAN"
}

@Entity()
export class Event implements EventProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    title!: string;

    @Column({nullable: false})
    description!: string;

    @Column({type: "int", nullable: true})
    maxParticipant!: number;

    @Column({type: "int", nullable: true})
    minParticipant!: number;

    @Column({type: "varchar", length: 255, nullable: false})
    image!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    address!: string;

    @Column({type: "varchar", nullable: true})
    zip!: string;

    @Column({type: "varchar", nullable: true})
    country!: string;

    @Column({type: "varchar", nullable: false})
    startDate!: string;

    @Column({type: "varchar", nullable: false})
    endDate!: string;

    @Column({type: "enum", enum: EventType, nullable: false})
    eventType!: string;

    @ManyToOne(() => User, user => user.event, {onDelete: 'CASCADE', nullable: false})
    creator: User;

    @OneToMany(() => EventParticipant, eventParticipant => eventParticipant.event)
    eventParticipants: EventParticipant[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
