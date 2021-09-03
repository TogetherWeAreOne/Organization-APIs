import {User} from "./user.models";
import {Product} from "./product.models";
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

export interface ProductPurchaseHistoryProps {
    user: User;
    product: Product;
    price: number;
    date: Date;
}

@Entity()
export class ProductPurchaseHistory implements ProductPurchaseHistoryProps {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, user => user.productPurchaseHistory, { nullable: false})
    user: User;

    @ManyToOne(() => Product, product => product.productPurchaseHistory, { nullable: false})
    product: Product;

    @Column({type: "float", nullable: false})
    price!: number;

    @Column({ nullable: false})
    date!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
