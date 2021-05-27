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


export interface ChecklistProps {
    title: string;
    task: Task;
}

@Entity()
export class Checklist implements ChecklistProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, unique: true, nullable: false})
    title!: string;

    @OneToMany(() => Option, option => option.checklist)
    options: Option[];

    @ManyToOne(() => Task, task => task.checklist)
    task: Task;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
