import {Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, UpdateDateColumn} from "typeorm";
import {User} from "./user.models";
import {Project} from "./project.models";
import "reflect-metadata";


export interface ProjectParticipantProps {
    pseudo: string;
    role: string;
    user: User;
    project: Project;
}

enum RoleEnum {
    GUEST = "GUEST",
    OWNER = "OWNER",
    EDITOR = "EDITOR"
}

@Entity({database : "organization_java"})
export class ProjectParticipant implements ProjectParticipantProps {

    @ManyToOne(() => User, user => user.projectParticipant, {primary: true, onDelete: 'CASCADE'})
    user: User;

    @ManyToOne(() => Project, project => project.projectParticipant, {primary: true, onDelete: 'CASCADE'})
    project: Project;

    @Column({type: "varchar", length: 255, nullable: false})
    pseudo!: string;

    @Column({type: "enum", enum: RoleEnum, nullable: false})
    role!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
