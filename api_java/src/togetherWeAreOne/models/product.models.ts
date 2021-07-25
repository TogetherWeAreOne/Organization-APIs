import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./user.models";
import "reflect-metadata";
import {ProductProposal} from "./productProposal.models";
import {ProductCategory} from "./productCategory.models";
import {ProductPurchaseHistoryModels} from "./productPurchaseHistory.models";

export interface ProductProps {
    name: string;
    description: string;
    price: number;
    quantity: number;
    negotiable: string;
    state: string;
    sended: boolean;
    selled: boolean;
    creator : User;
    category : ProductCategory;
    // category : ProductCategory; vérifier les routes
}

enum ProductState {
    AVAILABLE = "AVAILABLE",
    SOLD = "SOLD"
}

enum NegotiableProduct {
    TRUE = "TRUE",
    FALSE = "FALSE"
}

@Entity()
export class Product implements ProductProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    name!: string;

    @Column({type: "varchar",nullable: false})
    description!: string;

    @Column({type: "float", nullable: false})
    price!: number;

    @Column({type: "int", nullable: false})
    quantity!: number;

    @Column({type: "enum",enum : NegotiableProduct, nullable: false})
    negotiable!: string;

    @Column({type: "enum", enum : ProductState, nullable: false})
    state!: string;

    @Column({type: "boolean", nullable: false})
    selled!: boolean;

    @Column({type: "boolean", nullable: false})
    sended!: boolean;

    @Column({type: "date", nullable: true})
    sendedDate!: string;

    @OneToMany(() => ProductProposal, productProposals => productProposals.product)
    productProposals: ProductProposal[];

    @OneToMany(() => ProductPurchaseHistoryModels, productPurchaseHistory => productPurchaseHistory.product)
    productPurchaseHistory: ProductPurchaseHistoryModels[];

    @ManyToOne(() => User, user => user.product, {onDelete: 'CASCADE', nullable: false})
    creator: User;

    @ManyToOne(() => ProductCategory, productCategory => productCategory.products, {onDelete: 'CASCADE', nullable: false})
    category: ProductCategory;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

}
