import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import "reflect-metadata";
import {User} from "./user.models";
import {AuctionSaleProposal} from "./auctionSaleProposal.models";
import {AuctionSaleCategory} from "./auctionSaleCategory.models";
import {AuctionSaleWinHistoryModels} from "./auctionSaleWinHistory.models";
import {ProductImage} from "./productImage.models";
import {AuctionSaleImage} from "./auctionSaleImage.models";

export interface AuctionSaleProps {
    name: string;
    description: string;
    image: string;
    startPrice: number;
    actualPrice: number;
    endDate: string;
    state: string;
    sended: boolean;
    selled: boolean;
    sendedDate: string;
    creator: User;
    owner: User;
    category: AuctionSaleCategory;
}
enum AuctionSaleState {
    ONGOING = "ONGOING",
    FINISHED = "FINISHED"
}

@Entity()
export class AuctionSale implements AuctionSaleProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    name!: string;

    @Column({type: "varchar",nullable: false})
    description!: string;

    @Column({type: "varchar",nullable: false})
    image!: string;

    @Column({type: "float",nullable: false})
    startPrice!: number;

    @Column({type: "float", nullable: false})
    actualPrice!: number;

    @Column({type: "enum", enum : AuctionSaleState, nullable: false})
    state!: string;

    @Column({type: "boolean", nullable: false})
    selled!: boolean;

    @Column({type: "boolean", nullable: false})
    sended!: boolean;

    @Column({type: "datetime", nullable: false})
    endDate!: string;

    @Column({type: "date", nullable: true})
    sendedDate!: string;

    @OneToMany(() => AuctionSaleProposal, auctionProposals => auctionProposals.auctionSale)
    auctionSaleProposals: AuctionSaleProposal[];

    @OneToMany(() => AuctionSaleWinHistoryModels, auctionSaleWinHistory => auctionSaleWinHistory.auctionSale)
    auctionSaleWinHistory: AuctionSaleWinHistoryModels[];

    @OneToMany(() => AuctionSaleImage, auctionSaleImage => auctionSaleImage.auctionSale)
    images: AuctionSaleImage[];

    @ManyToOne(() => User, user => user.auctionSales, {onDelete: 'CASCADE', nullable: false})
    creator: User;

    @ManyToOne(() => User, user => user.auctionSales, {onDelete: 'CASCADE'})
    owner: User;

    @ManyToOne(() => AuctionSaleCategory, auctionSaleCategory => auctionSaleCategory.auctionSales, {onDelete: 'CASCADE'})
    category!: AuctionSaleCategory;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

}
