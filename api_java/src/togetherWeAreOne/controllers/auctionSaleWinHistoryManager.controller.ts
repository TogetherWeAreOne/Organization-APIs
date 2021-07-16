import {getRepository, Repository} from "typeorm";
import {User} from "../models/user.models";
import {AuctionSaleWinHistoryModels, AuctionSaleWinHistoryProps} from "../models/auctionSaleWinHistory.models";

export class AuctionSaleWinHistoryManagerController {

    private static instance: AuctionSaleWinHistoryManagerController;
    private auctionSalesWinHistoryRepository: Repository<AuctionSaleWinHistoryModels>;


    private constructor() {
        this.auctionSalesWinHistoryRepository = getRepository(AuctionSaleWinHistoryModels);
    }

    public static async getInstance(): Promise<AuctionSaleWinHistoryManagerController> {
        if (AuctionSaleWinHistoryManagerController.instance === undefined) {
            AuctionSaleWinHistoryManagerController.instance = new AuctionSaleWinHistoryManagerController();
        }
        return AuctionSaleWinHistoryManagerController.instance;
    }

    public async saveAuctionSaleWin(props: AuctionSaleWinHistoryProps): Promise<AuctionSaleWinHistoryModels> {
        const auctionSaleWin = this.auctionSalesWinHistoryRepository.create({
            ...props
        });
        await this.auctionSalesWinHistoryRepository.save(auctionSaleWin);

        return auctionSaleWin;
    }

    public async getAuctionSalesAuctionSaleWinHistoryByUser( user: User ): Promise<AuctionSaleWinHistoryModels[]> {
        return this.auctionSalesWinHistoryRepository.find({ user: user });
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

}
