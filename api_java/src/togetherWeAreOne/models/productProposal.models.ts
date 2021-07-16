import {User} from "./user.models";
import {AuctionSale} from "./auctionSale.models";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Product} from "./product.models";

enum ProductProposalStateEnum {
    PENDING = "PENDING",
    REFUSED = "REFUSED",
    ACCEPTED = "ACCEPTED"
}

export interface ProductProposalProps {
    user: User;
    product: Product;
    price: number;
    message: string;
    state: string;
}

@Entity()
export class ProductProposal implements ProductProposalProps {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, user => user.productProposals, {primary : true, onDelete: 'CASCADE', nullable: false})
    user: User;

    @ManyToOne(() => Product, product => product.productProposals, {primary : true, onDelete: 'CASCADE', nullable: false})
    product: Product;

    @Column({type: "float", nullable: false})
    price!: number;

    @Column({type: "varchar", nullable: false})
    message!: string;

    @Column({type: "enum", enum: ProductProposalStateEnum, nullable: false})
    state!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

}
