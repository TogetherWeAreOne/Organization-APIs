import {getRepository, Repository} from "typeorm";
import {User} from "../models/user.models";
import {AuctionSale} from "../models/auctionSale.models";
import {AuctionSaleProposal, AuctionSaleProposalProps} from "../models/auctionSaleProposal.models";
import {EventProps} from "../models/event.models";

export class AuctionSaleProposalManagerController {

    private static instance: AuctionSaleProposalManagerController;
    private auctionSalesProposalRepository: Repository<AuctionSaleProposal>;


    private constructor() {
        this.auctionSalesProposalRepository = getRepository(AuctionSaleProposal);
    }

    public static async getInstance(): Promise<AuctionSaleProposalManagerController> {
        if (AuctionSaleProposalManagerController.instance === undefined) {
            AuctionSaleProposalManagerController.instance = new AuctionSaleProposalManagerController();
        }
        return AuctionSaleProposalManagerController.instance;
    }

    public async makeAuctionSaleProposal(props: AuctionSaleProposalProps): Promise<AuctionSaleProposal> {
        const auctionSaleProposal = this.auctionSalesProposalRepository.create({
            ...props
        });
        await this.auctionSalesProposalRepository.save(auctionSaleProposal);

        return auctionSaleProposal;
    }

    public async updateAuctionSaleProposal(props: AuctionSaleProposal) {
        return await this.auctionSalesProposalRepository.save(props)
    }

    public async getAuctionSalesProposalByUserAndByAuctionSale(user: User, auctionSale: AuctionSale ): Promise<AuctionSaleProposal> {
        return this.auctionSalesProposalRepository.findOne({user: user, auctionSale: auctionSale, state : 'PENDING'},{relations : ["user","auctionSale"]});
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getAuctionSalesProposalByUser( user: User ): Promise<AuctionSaleProposal[]> {
        return this.auctionSalesProposalRepository.find({ user: user });
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getAuctionSalesProposalByAuctionSale( auctionSale: AuctionSale ): Promise<AuctionSaleProposal[]> {
        return this.auctionSalesProposalRepository.find({ auctionSale: auctionSale });
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }


    public async getAllAuctionSales(): Promise<AuctionSaleProposal[]> {
        return this.auctionSalesProposalRepository.find();
    }

    public async deleteAuctionSalesById(id: string) {
        await this.auctionSalesProposalRepository.softDelete(id);
    }
}
