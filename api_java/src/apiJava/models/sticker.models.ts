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
import {TaskHasSticker} from "./task_has_sticker.models";
import {User} from "./user.models";


export interface StickerProps {
    title: string;
    color: string;
}

@Entity({database : "organization_java"})
export class Sticker implements StickerProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, unique: true, nullable: false})
    title!: string;

    @Column({type: "varchar", length: 255, unique: true, nullable: false})
    color!: string;

    @OneToMany(() => TaskHasSticker, taskHasStickerS => taskHasStickerS.sticker)
    taskHasStickerS: TaskHasSticker[];

    @ManyToOne(() => User, user => user.sticker, {onDelete: 'CASCADE', nullable: false})
    user: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
