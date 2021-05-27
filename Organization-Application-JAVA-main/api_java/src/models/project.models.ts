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
import {User} from "./user.models";
import {Columns} from "./column.models";
import {ProjectParticipant} from "./projectParticipant";


export interface ProjectProps {
    title: string;
    description: string;
    user: User
}

@Entity()
export class Project implements ProjectProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    title!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    description!: string;

    @OneToMany(() => Columns, columns => columns.project)
    column: Columns[];

    @OneToMany(() => ProjectParticipant, projectParticipant => projectParticipant.project)
    projectParticipant: ProjectParticipant[];

    @ManyToOne(() => User, user => user.project)
    user: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
