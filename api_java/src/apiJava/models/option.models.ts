import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Checklist} from "./checklist.models";
import {User} from "./user.models";


export interface OptionsProps {
    title: string;
    state: string;
    checklist: Checklist;
}

enum StateEnum {
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED",
    NOT_STARTED = "NOT_STARTED"
}

@Entity({database : "organization_java"})
export class Option implements OptionsProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, unique: true, nullable: false})
    title!: string;

    @Column({type: "enum", enum: StateEnum, nullable: false})
    state!: string;

    @ManyToOne(() => Checklist, checklist => checklist.options, {onDelete: 'CASCADE', nullable: false})
    checklist: Checklist;

    @ManyToOne(() => User, user => user.option, {onDelete: 'CASCADE', nullable: false})
    user: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
