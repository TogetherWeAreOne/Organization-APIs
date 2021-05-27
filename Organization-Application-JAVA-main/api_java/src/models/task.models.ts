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

export interface TaskProps {
    title: string;
    description: string;
    priority: string;
    column: Columns;
}

enum PriorityEnum {
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "low"
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

    @OneToMany(() => Checklist, cheklist => cheklist.task)
    checklist: Checklist[];

    @ManyToOne(() => Columns, columns => columns.tasks)
    column: Columns;

    @ManyToOne(() => TaskHasSticker, taskHasSticker => taskHasSticker.task)
    taskHasSticker: TaskHasSticker;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
