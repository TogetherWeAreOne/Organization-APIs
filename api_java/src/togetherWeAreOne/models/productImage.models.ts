import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import "reflect-metadata";
import {Product} from "./product.models";

export interface ProductImageProps {
    url: string;
    product : Product;
}

@Entity()
export class ProductImage implements ProductImageProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    url!: string;

    @ManyToOne(() => Product, product => product.images, {onDelete: 'CASCADE', nullable: false})
    product: Product;


    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

}
