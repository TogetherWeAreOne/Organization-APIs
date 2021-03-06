import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import "reflect-metadata";
import {Task} from "./task.models";
import {Option} from "./option.models";
import {User} from "./user.models";


export interface ChecklistProps {
    title: string;
    percentage: number;
    state: string
    task: Task;

}

enum StateEnum {
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED",
    NOT_STARTED = "NOT_STARTED"
}

@Entity({database : "organization_java"})
export class Checklist implements ChecklistProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, unique: true, nullable: false})
    title!: string;

    @Column({type: "integer", nullable: false})
    percentage!: number;

    @Column({type: "enum", enum: StateEnum, nullable: false})
    state!: string;

    @OneToMany(() => Option, option => option.checklist)
    options: Option[];

    @ManyToOne(() => Task, task => task.checklist, {onDelete: 'CASCADE', nullable: false})
    task!: Task;

    @ManyToOne(() => User, user => user.checklist, {onDelete: 'CASCADE', nullable: false})
    user: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
