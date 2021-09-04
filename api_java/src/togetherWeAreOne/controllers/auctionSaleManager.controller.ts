import {getRepository, Repository} from "typeorm";
import {User} from "../models/user.models";

import {Product} from "../models/product.models";
import {AuctionSale, AuctionSaleProps} from "../models/auctionSale.models";
import {AuctionSaleProposal} from "../models/auctionSaleProposal.models";
import {AuctionSaleCategory} from "../models/auctionSaleCategory.models";
import {ProductImage, ProductImageProps} from "../models/productImage.models";
import {AuctionSaleImage, AuctionSaleImageProps} from "../models/auctionSaleImage.models";

export class AuctionSaleManagerController {

    private static instance: AuctionSaleManagerController;
    private userRepository: Repository<User>;
    private auctionSalesRepository: Repository<AuctionSale>;
    private auctionSalesImageRepository: Repository<AuctionSaleImage>;

    private constructor() {
        this.userRepository = getRepository(User);
        this.auctionSalesRepository = getRepository(AuctionSale);
        this.auctionSalesImageRepository = getRepository(AuctionSaleImage);
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

    public async saveImage(props: AuctionSaleImageProps): Promise<AuctionSaleImage> {
        const auctionSaleImage = this.auctionSalesImageRepository.create({
            ...props
        });
        await this.auctionSalesImageRepository.save(auctionSaleImage);

        return auctionSaleImage;
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

    public async getImageByAuction(auction: AuctionSale): Promise<AuctionSaleImage[]> {
        console.log("je suis rentré");
        return this.auctionSalesImageRepository.find( {where : { auctionSale : auction }});
    }

    public async getAllAuctionSalesByAuctionSaleCategory(auctionSaleCategory : AuctionSaleCategory): Promise<AuctionSale[]> {
        return this.auctionSalesRepository.find({category : auctionSaleCategory });
    }

    public async getAllAuctionSalesByUser(user : User): Promise<AuctionSale[]> {
        return this.auctionSalesRepository.find({where : {creator:user}, relations: ["category", "creator"]});
    }

    public async getAllAuctionSales(): Promise<AuctionSale[]> {
        return this.auctionSalesRepository.find( {relations: ["category", "creator"]});
    }

    public async deleteAuctionSalesById(id: string) {
        await this.auctionSalesRepository.softDelete(id);
    }
}
