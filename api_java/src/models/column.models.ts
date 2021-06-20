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
import {User} from "./user.models";


export interface ColumnProps {
    title: string;
    project: Project;
    user: User;
}

@Entity()
export class Columns implements ColumnProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, unique: true, nullable: false})
    title!: string;

    @OneToMany(() => Task, tasks => tasks.column, {cascade: true})
    tasks: Task[];

    @ManyToOne(() => Project, project => project.column, {onDelete: 'CASCADE'})
    project: Project;

    @ManyToOne(() => User, user => user.columns, {onDelete: 'CASCADE'})
    user: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
