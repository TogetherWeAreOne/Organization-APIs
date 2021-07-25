import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import "reflect-metadata";
import {AuctionSale} from "./auctionSale.models";
import {User} from "./user.models";

export interface AuctionSaleWinHistoryProps {
    user: User;
    auctionSale: AuctionSale;
    price: number;
    date: string;
}

@Entity()
export class AuctionSaleWinHistoryModels implements AuctionSaleWinHistoryProps {

    @ManyToOne(() => User, user => user.auctionSaleWinHistory, {primary : true, onDelete: 'CASCADE', nullable: false})
    user: User;

    @ManyToOne(() => AuctionSale, auctionSale => auctionSale.auctionSaleWinHistory, {primary : true, onDelete: 'CASCADE', nullable: false})
    auctionSale: AuctionSale;

    @Column({type: "float", nullable: false})
    price!: number;

    @Column({type:"date", nullable: false})
    date!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

}
