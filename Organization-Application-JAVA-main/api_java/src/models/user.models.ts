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

    @OneToMany(() => ProjectParticipant, projectParticipant => projectParticipant.user)
    projectParticipant: ProjectParticipant[];

    @OneToMany(() => Project, project => project.user)
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
