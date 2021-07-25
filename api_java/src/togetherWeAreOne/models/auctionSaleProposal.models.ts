import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne, PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User, UserProps} from "./user.models";
import "reflect-metadata";
import {AuctionSale} from "./auctionSale.models";

enum AuctionSaleProposalStateEnum {
    PENDING = "PENDING",
    REFUSED = "REFUSED",
    ACCEPTED = "ACCEPTED"
}

export interface AuctionSaleProposalProps {
    user: User;
    auctionSale: AuctionSale;
    price: number;
    state: string;
}

@Entity()
export class AuctionSaleProposal implements AuctionSaleProposalProps {

    @ManyToOne(() => User, user => user.auctionSaleProposals, {primary : true, onDelete: 'CASCADE', nullable: false})
    user: User;

    @ManyToOne(() => AuctionSale, auctionSale => auctionSale.auctionSaleProposals, {primary : true, onDelete: 'CASCADE', nullable: false})
    auctionSale: AuctionSale;

    @Column({type: "float", nullable: false})
    price!: number;

    @Column({type:"enum", enum: AuctionSaleProposalStateEnum, nullable: false})
    state!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

}
