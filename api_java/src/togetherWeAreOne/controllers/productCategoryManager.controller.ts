import {getRepository, Repository} from "typeorm";

import {ProductCategory, ProductCategoryProps} from "../models/productCategory.models";

export class ProductCategoryManagerController {

    private static instance: ProductCategoryManagerController;
    private productCategoryRepository: Repository<ProductCategory>;

    private constructor() {
        this.productCategoryRepository = getRepository(ProductCategory);
    }

    public static async getInstance(): Promise<ProductCategoryManagerController> {
        if (ProductCategoryManagerController.instance === undefined) {
            ProductCategoryManagerController.instance = new ProductCategoryManagerController();
        }
        return ProductCategoryManagerController.instance;
    }

    public async createProductCategory(props: ProductCategoryProps): Promise<ProductCategory> {
        const productCategory = this.productCategoryRepository.create({
            ...props
        });
        await this.productCategoryRepository.save(productCategory);

        return productCategory;
    }

    public async updateProductCategory(id: string, props: ProductCategoryProps) {
        const result = await this.productCategoryRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async getProductCategoryById(id: string): Promise<ProductCategory> {
        return this.productCategoryRepository.findOneOrFail(id)
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getProductCategoryByName(name: string): Promise<ProductCategory> {
        return this.productCategoryRepository.findOneOrFail({name: name})
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getAllProductCategory(): Promise<ProductCategory[]> {
        return this.productCategoryRepository.find();
    }

    public async deleteProductCategoryById(id: string) {
        await this.productCategoryRepository.softDelete(id);
    }
}
