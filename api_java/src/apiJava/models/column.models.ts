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
import {Project} from "./project.models";
import {Task} from "./task.models";
import {User} from "./user.models";


export interface ColumnProps {
    title: string;
    project: Project;
    user: User;
}

@Entity({database : "organization_java"})
export class Columns implements ColumnProps {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, unique: true, nullable: false})
    title!: string;

    @OneToMany(() => Task, tasks => tasks.column)
    tasks: Task[];

    @ManyToOne(() => Project, project => project.column, {onDelete: 'CASCADE', nullable: false})
    project: Project;

    @ManyToOne(() => User, user => user.columns, {onDelete: 'CASCADE', nullable: false})
    user: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
