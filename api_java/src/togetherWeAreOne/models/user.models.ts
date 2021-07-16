import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Event} from "./event.models";
import {Product} from "./product.models";
import {AuctionSale} from "./auctionSale.models";
import {Message} from "./message.models";
import {EventParticipant} from "./eventParticipant.models";
import {AuctionSaleProposal} from "./auctionSaleProposal.models";
import {ProductProposal} from "./productProposal.models";
import {UserBlockedUser} from "./userBlockUser.models";
import {AuctionSaleWinHistoryModels} from "./auctionSaleWinHistory.models";
import {ProductPurchaseHistoryModels} from "./productPurchaseHistory.models";

export interface UserProps {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    pseudo: string;
    image: string;
    role: string;
    birthdate: string;
    address: string;
    zip: string;
    country: string;
    phone: string;
    certified: boolean;
}

enum RoleEnum {
    ADMIN = "ADMIN",
    USER = "USER",
    ORGANISATION = "ORGANISATION",
    PRO = "PRO"
}

@Entity()
export class User implements UserProps {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", length: 255, unique: true, nullable: false})
    email!: string;

    @Column({nullable: false})
    password!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    firstname!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    lastname!: string;

    @Column({type: "varchar", length: 255, nullable: false})
    pseudo!: string;

    @Column({type: "enum", enum: RoleEnum, nullable: false})
    role!: string;

    @Column({type: "varchar", nullable: true})
    image!: string;

    @Column({type: "varchar", nullable: false})
    birthdate!: string;

    @Column({type: "varchar", nullable: true})
    address!: string;

    @Column({type: "varchar", nullable: true})
    zip!: string;

    @Column({type: "varchar", nullable: true})
    country!: string;

    @Column({type: "varchar", nullable: true})
    phone!: string;

    @Column({type: "boolean", nullable: true})
    certified!: boolean;

    @OneToMany(() => Event, event => event.creator)
    event: Event[];

    @OneToMany(() => Product, product => product.creator)
    product: Product[];

    @OneToMany(() => AuctionSale, auctionSales => auctionSales.creator)
    auctionSales: AuctionSale[];

    @OneToMany(() => AuctionSale, auctionSales => auctionSales.owner)
    auctionSaleOwner: AuctionSale[];

    @OneToMany(() => Message, message => message.sender)
    messageSended: Message[];

    @OneToMany(() => Message, message => message.receiver)
    messageReceived: Message[];

    @OneToMany(() => UserBlockedUser, userBlockedUser => userBlockedUser.blockerUser)
    usersBlocked: UserBlockedUser[];

    @OneToMany(() => UserBlockedUser, userBlockedUser => userBlockedUser.blockedUser)
    blockedByUsers: UserBlockedUser[];

    @OneToMany(() => EventParticipant, eventParticipant => eventParticipant.user)
    eventParticipants: EventParticipant[];

    @OneToMany(() => AuctionSaleProposal, auctionSaleProposals => auctionSaleProposals.user)
    auctionSaleProposals: AuctionSaleProposal[];

    @OneToMany(() => ProductProposal, productProposals => productProposals.user)
    productProposals: ProductProposal[];

    @OneToMany(() => AuctionSaleWinHistoryModels, auctionSaleWinHistory => auctionSaleWinHistory.user)
    auctionSaleWinHistory: AuctionSaleWinHistoryModels[];

    @OneToMany(() => ProductPurchaseHistoryModels, productPurchaseHistory => productPurchaseHistory.user)
    productPurchaseHistory: ProductPurchaseHistoryModels[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

}
