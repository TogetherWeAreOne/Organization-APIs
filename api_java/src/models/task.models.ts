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
import {Columns} from "./column.models";
import {Checklist} from "./checklist.models";
import {TaskHasSticker} from "./task_has_sticker.models";
import {User} from "./user.models";

export interface TaskProps {
    title: string;
    description: string;
    priority: string;
    state: string;
    column: Columns;
}

enum PriorityEnum {
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "low"
}

enum StateEnum {
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED",
    NOT_STARTED = "NOT_STARTED"
}

@Entity()
export class Task implements TaskProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, unique: true, nullable: false})
    title!: string;

    @Column({type: "varchar", length: 255, nullable: true})
    description!: string;

    @Column({type: "enum", enum: PriorityEnum, nullable: false})
    priority!: string;

    @Column({type: "enum", enum: StateEnum, nullable: false})
    state!: string;

    @OneToMany(() => Checklist, cheklist => cheklist.task, {cascade: true})
    checklist: Checklist[];

    @ManyToOne(() => Columns, columns => columns.tasks, {onDelete: 'CASCADE'})
    column: Columns;

    @OneToMany(() => TaskHasSticker, taskHasStickerT => taskHasStickerT.task, {onDelete: 'CASCADE'})
    taskHasStickerT: TaskHasSticker[];

    @ManyToOne(() => User, user => user.task, {onDelete: 'CASCADE'})
    user: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
