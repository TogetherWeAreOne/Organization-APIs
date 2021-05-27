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
import {Project} from "./project.models";
import {Task} from "./task.models";


export interface ColumnProps {
    title: string;
    project: Project;
}

@Entity()
export class Columns implements ColumnProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, unique: true, nullable: false})
    title!: string;

    @OneToMany(() => Task, tasks => tasks.column)
    tasks: Task[];

    @ManyToOne(() => Project, project => project.column)
    project: Project;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
