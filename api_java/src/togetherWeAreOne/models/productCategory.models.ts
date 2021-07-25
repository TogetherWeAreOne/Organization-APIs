import {
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import "reflect-metadata";
import {Product} from "./product.models";

export interface ProductCategoryProps {
    name: string;
}

@Entity()
export class ProductCategory implements ProductCategoryProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, nullable: false, unique : true})
    name!: string;

    @OneToMany(() => Product, product => product.category)
    products: Product[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

}
