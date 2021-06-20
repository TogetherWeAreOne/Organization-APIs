import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Project} from "./project.models";
import {ProjectParticipant} from "./projectParticipant";
import {Checklist} from "./checklist.models";
import {Columns} from "./column.models";
import {Option} from "./option.models";
import {Sticker} from "./sticker.models";
import {Task} from "./task.models";


export interface UserProps {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    pseudo: string;
    initial: string;
    image: string;
}

@Entity()
export class User implements UserProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, unique: true, nullable: false})
    email!: string;

    @Column({nullable: false})
    password!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    firstname!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    lastname!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    pseudo!: string;

    @Column({type: "varchar", length: 10, nullable: false})
    initial!: string;

    @Column({type: "varchar", nullable: false})
    image!: string;

    @OneToMany(() => ProjectParticipant, projectParticipant => projectParticipant.user,{cascade: true})
    projectParticipant: ProjectParticipant[];

    @OneToMany(() => Checklist, checklist => checklist.user,{cascade: true})
    checklist: Checklist[];

    @OneToMany(() => Columns, columns => columns.user,{cascade: true})
    columns: Columns[];

    @OneToMany(() => Option, option => option.user,{cascade: true})
    option: Option[];

    @OneToMany(() => Sticker, sticker => sticker.user,{cascade: true})
    sticker: Sticker[];

    @OneToMany(() => Task, task => task.user,{cascade: true})
    task: Task[];

    @OneToMany(() => Project, project => project.user,{cascade: true})
    project: Project[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    public getUserId() {
        return this.id;
    }
}
