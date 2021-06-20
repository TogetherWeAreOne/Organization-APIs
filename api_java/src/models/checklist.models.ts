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

@Entity()
export class Checklist implements ChecklistProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, unique: true, nullable: false})
    title!: string;

    @Column({type: "integer", nullable: false})
    percentage!: number;

    @Column({type: "enum", enum: StateEnum, nullable: false})
    state!: string;

    @OneToMany(() => Option, option => option.checklist,{cascade: true})
    options: Option[];

    @ManyToOne(() => Task, task => task.checklist, { onDelete: 'CASCADE'})
    task: Task;

    @ManyToOne(() => User, user => user.checklist, { onDelete: 'CASCADE'})
    user: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
