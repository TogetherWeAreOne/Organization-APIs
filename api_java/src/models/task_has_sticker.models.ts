import {CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, UpdateDateColumn} from "typeorm";
import {Sticker} from "./sticker.models";
import {Task} from "./task.models";


export interface TaskHasStickerProps {
    sticker: Sticker;
    task: Task;
}

@Entity()
export class TaskHasSticker implements TaskHasStickerProps {

    @ManyToOne(() => Sticker, sticker => sticker.taskHasStickerS, {primary: true, onDelete: 'CASCADE'})
    sticker: Sticker;

    @ManyToOne(() => Task, task => task.taskHasStickerT, {primary: true, onDelete: 'CASCADE'})
    task: Task;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
