import {getRepository, Repository} from "typeorm";
import {User} from "../models/user.models";

import {Product} from "../models/product.models";
import {AuctionSale, AuctionSaleProps} from "../models/auctionSale.models";
import {AuctionSaleProposal} from "../models/auctionSaleProposal.models";
import {AuctionSaleCategory} from "../models/auctionSaleCategory.models";

export class AuctionSaleManagerController {

    private static instance: AuctionSaleManagerController;
    private userRepository: Repository<User>;
    private auctionSalesRepository: Repository<AuctionSale>;
    private productRepository: Repository<Product>;

    private constructor() {
        this.userRepository = getRepository(User);
        this.auctionSalesRepository = getRepository(AuctionSale);
        this.productRepository = getRepository(Product);
    }

    public static async getInstance(): Promise<AuctionSaleManagerController> {
        if (AuctionSaleManagerController.instance === undefined) {
            AuctionSaleManagerController.instance = new AuctionSaleManagerController();
        }
        return AuctionSaleManagerController.instance;
    }

    public async createAuctionSales(props: AuctionSaleProps): Promise<AuctionSale> {
        const product = this.auctionSalesRepository.create({
            ...props
        });
        await this.auctionSalesRepository.save(product);

        return product;
    }

    public async updateAuctionSales(id: string, props: AuctionSaleProps) {
        const result = await this.auctionSalesRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async getAuctionSalesById(id: string): Promise<AuctionSale> {
        return await this.auctionSalesRepository.findOne(id,{relations : ["owner","category","creator"]});
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getAllAuctionSalesByAuctionSaleCategory(auctionSaleCategory : AuctionSaleCategory): Promise<AuctionSale[]> {
        return this.auctionSalesRepository.find({category : auctionSaleCategory });
    }

    public async getAllAuctionSalesByUser(user : User): Promise<AuctionSale[]> {
        return this.auctionSalesRepository.find({creator:user});
    }

    public async deleteAuctionSalesById(id: string) {
        await this.auctionSalesRepository.softDelete(id);
    }
}
