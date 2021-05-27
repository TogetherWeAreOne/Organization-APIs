import {Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, UpdateDateColumn} from "typeorm";
import {User} from "./user.models";
import {Project} from "./project.models";


export interface ProjectParticipantProps {
    pseudo: string;
    user: User;
    project: Project;
}

@Entity()
export class ProjectParticipant implements ProjectParticipantProps {

    @ManyToOne(() => User, user => user.projectParticipant, {primary: true})
    user: User;

    @ManyToOne(() => Project, project => project.projectParticipant, {primary: true})
    project: Project;

    @Column({type: "varchar", length: 255, nullable: false})
    pseudo!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
