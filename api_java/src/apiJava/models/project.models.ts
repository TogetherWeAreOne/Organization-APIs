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
import {AccessCode} from "./accesCode.model";


export interface ProjectProps {
    title: string;
    description: string;
    user: User
}

@Entity({database : "organization_java"})
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

    @OneToMany(() => AccessCode, accessCode => accessCode.project)
    accessCodes: AccessCode[];

    @ManyToOne(() => User, user => user.project, {onDelete: 'CASCADE', nullable: false})
    user: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
