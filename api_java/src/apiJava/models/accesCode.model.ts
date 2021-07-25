import {
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import "reflect-metadata";
import {Project} from "./project.models";

export interface AccessCodeProps {
    state: string;
    remainingUse: number;
}

enum StateEnum {
    USED = "USED",
    UNUSED = "UNUSED"
}


@Entity({database : "organization_java"})
export class AccessCode implements AccessCodeProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "enum", enum: StateEnum, nullable: false})
    state!: string;

    @Column({type: "int", nullable: false})
    remainingUse!: number;


    @ManyToOne(() => Project, project => project.accessCodes, {onDelete: 'CASCADE'})
    project: Project;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
