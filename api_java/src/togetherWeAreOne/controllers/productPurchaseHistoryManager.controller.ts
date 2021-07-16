import {getRepository, Repository} from "typeorm";
import {User} from "../models/user.models";
import {AuctionSaleWinHistoryModels, AuctionSaleWinHistoryProps} from "../models/auctionSaleWinHistory.models";
import {ProductPurchaseHistoryModels, ProductPurchaseHistoryProps} from "../models/productPurchaseHistory.models";
import {Product} from "../models/product.models";

export class ProductPurchaseHistoryManagerController {

    private static instance: ProductPurchaseHistoryManagerController;
    private productPurchaseHistoryRepository: Repository<ProductPurchaseHistoryModels>;


    private constructor() {
        this.productPurchaseHistoryRepository = getRepository(ProductPurchaseHistoryModels);
    }

    public static async getInstance(): Promise<ProductPurchaseHistoryManagerController> {
        if (ProductPurchaseHistoryManagerController.instance === undefined) {
            ProductPurchaseHistoryManagerController.instance = new ProductPurchaseHistoryManagerController();
        }
        return ProductPurchaseHistoryManagerController.instance;
    }

    public async saveProductPurchase(props: ProductPurchaseHistoryProps): Promise<ProductPurchaseHistoryModels> {
        const productPurchase = this.productPurchaseHistoryRepository.create({
            ...props
        });
        await this.productPurchaseHistoryRepository.save(productPurchase);

        return productPurchase;
    }

    public async getProductPurchaseHistoryByUser( user: User ): Promise<ProductPurchaseHistoryModels[]> {
        return this.productPurchaseHistoryRepository.find({ user: user });
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getProductPurchaseHistoryByProduct( product: Product ): Promise<ProductPurchaseHistoryModels[]> {
        return this.productPurchaseHistoryRepository.find({ product: product });
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

}
