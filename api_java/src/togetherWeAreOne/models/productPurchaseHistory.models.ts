import {User} from "./user.models";
import {Product} from "./product.models";
import {Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, UpdateDateColumn} from "typeorm";

export interface ProductPurchaseHistoryProps {
    user: User;
    product: Product;
    price: number;
    date: string;
}

@Entity()
export class ProductPurchaseHistoryModels implements ProductPurchaseHistoryProps {

    @ManyToOne(() => User, user => user.productPurchaseHistory, {primary : true, onDelete: 'CASCADE', nullable: false})
    user: User;

    @ManyToOne(() => Product, product => product.productPurchaseHistory, {primary : true, onDelete: 'CASCADE', nullable: false})
    product: Product;

    @Column({type: "float", nullable: false})
    price!: number;

    @Column({type: "date", nullable: false})
    date!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

}
