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
import {AuctionSale} from "./auctionSale.models";

export interface AuctionSaleImageProps {
    url: string;
    auctionSale : AuctionSale;
}

@Entity()
export class AuctionSaleImage implements AuctionSaleImageProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    url!: string;

    @ManyToOne(() => AuctionSale, auctionSale => auctionSale.images, {onDelete: 'CASCADE', nullable: false})
    auctionSale: AuctionSale;


    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

}
