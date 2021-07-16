import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Product} from "./product.models";
import {AuctionSale} from "./auctionSale.models";

export interface AuctionSaleCategoryProps {
    name: string;
}

@Entity()
export class AuctionSaleCategory implements AuctionSaleCategoryProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, nullable: false, unique : true})
    name!: string;

    @OneToMany(() => AuctionSale, auctionSale => auctionSale.category)
    auctionSales: AuctionSale[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

}
