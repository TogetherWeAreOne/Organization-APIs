import {getRepository, Repository} from "typeorm";
import {ProductCategory, ProductCategoryProps} from "../models/productCategory.models";
import {AuctionSaleCategory, AuctionSaleCategoryProps} from "../models/auctionSaleCategory.models";

export class AuctionSaleCategoryManagerController {

    private static instance: AuctionSaleCategoryManagerController;
    private auctionSaleCategoryRepository: Repository<AuctionSaleCategory>;

    private constructor() {
        this.auctionSaleCategoryRepository = getRepository(AuctionSaleCategory);
    }

    public static async getInstance(): Promise<AuctionSaleCategoryManagerController> {
        if (AuctionSaleCategoryManagerController.instance === undefined) {
            AuctionSaleCategoryManagerController.instance = new AuctionSaleCategoryManagerController();
        }
        return AuctionSaleCategoryManagerController.instance;
    }

    public async createAuctionSaleCategory(props: AuctionSaleCategoryProps): Promise<AuctionSaleCategory> {
        const auctionSaleCategory = this.auctionSaleCategoryRepository.create({
            ...props
        });
        await this.auctionSaleCategoryRepository.save(auctionSaleCategory);

        return auctionSaleCategory;
    }

    public async updateAuctionSaleCategory(id: string, props: AuctionSaleCategoryProps) {
        const result = await this.auctionSaleCategoryRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async getAuctionSaleCategoryById(id: string): Promise<AuctionSaleCategory> {
        return this.auctionSaleCategoryRepository.findOneOrFail(id)
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getAuctionSaleCategoryByName(name: string): Promise<AuctionSaleCategory> {
        return this.auctionSaleCategoryRepository.findOneOrFail({name: name})
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getAllAuctionSaleCategory(): Promise<AuctionSaleCategory[]> {
        return this.auctionSaleCategoryRepository.find();
    }

    public async deleteAuctionSaleCategoryById(id: string) {
        await this.auctionSaleCategoryRepository.softDelete(id);
    }
}
