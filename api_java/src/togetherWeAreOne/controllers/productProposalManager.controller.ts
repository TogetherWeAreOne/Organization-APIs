import {getRepository, Repository} from "typeorm";
import {AuctionSaleProposal, AuctionSaleProposalProps} from "../models/auctionSaleProposal.models";
import {User} from "../models/user.models";
import {AuctionSale} from "../models/auctionSale.models";
import {ProductProposal, ProductProposalProps, ProductProposalStateEnum} from "../models/productProposal.models";
import {Product} from "../models/product.models";

export class ProductProposalManagerController {

    private static instance: ProductProposalManagerController;
    private productProposalRepository: Repository<ProductProposal>;


    private constructor() {
        this.productProposalRepository = getRepository(ProductProposal);
    }

    public static async getInstance(): Promise<ProductProposalManagerController> {
        if (ProductProposalManagerController.instance === undefined) {
            ProductProposalManagerController.instance = new ProductProposalManagerController();
        }
        return ProductProposalManagerController.instance;
    }

    public async makeProductProposal(props: ProductProposalProps): Promise<ProductProposal> {
        const productProposal = this.productProposalRepository.create({
            ...props
        });
        await this.productProposalRepository.save(productProposal);

        return productProposal;
    }

    public async updateProductProposal(props: ProductProposal) {
        return await this.productProposalRepository.save(props)
    }

    public async getProductProposalByUserAndByProduct(user: User, product: Product ): Promise<ProductProposal> {
        return this.productProposalRepository.findOneOrFail({user: user, product: product}, {relations : ["user","product"]});
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getProductProposalByUser( user: User ): Promise<ProductProposal[]> {
        return this.productProposalRepository.find({ user: user });
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getProductProposalByProduct( product: Product ): Promise<ProductProposal[]> {
        return this.productProposalRepository.find({where:{ product: product, state : ProductProposalStateEnum.PENDING },relations: ["user", "product"]});
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getAllProductProposal(): Promise<ProductProposal[]> {
        return this.productProposalRepository.find();
    }

    public async deleteProductProposalById(id: string) {
        await this.productProposalRepository.softDelete(id);
    }
}
