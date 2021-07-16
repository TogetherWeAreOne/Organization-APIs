import {getRepository, Repository} from "typeorm";
import {User} from "../models/user.models";
import {Product, ProductProps} from "../models/product.models";
import {ProductCategory} from "../models/productCategory.models";
import {SearchProduct} from "../models/searchProduct.models";

export class ProductManagerController {

    private static instance: ProductManagerController;
    private userRepository: Repository<User>;
    private productRepository: Repository<Product>;

    private constructor() {
        this.userRepository = getRepository(User);
        this.productRepository = getRepository(Product);
    }

    public static async getInstance(): Promise<ProductManagerController> {
        if (ProductManagerController.instance === undefined) {
            ProductManagerController.instance = new ProductManagerController();
        }
        return ProductManagerController.instance;
    }

    public async createProduct(props: ProductProps): Promise<Product> {
        const product = this.productRepository.create({
            ...props
        });
        await this.productRepository.save(product);

        return product;
    }

    public async updateProduct(id: string, props: ProductProps) {
        const result = await this.productRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async getProductById(id: string): Promise<Product> {
        return this.productRepository.findOne(id)
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getProductByCreator(user: User): Promise<Product[]> {
        return this.productRepository.find({ creator: user});
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getAllProduct(): Promise<Product[]> {
        return this.productRepository.find();
    }

    public async deleteProductById(id: string) {
        await this.productRepository.softDelete(id);
    }

    public async getProductBySearch(search : SearchProduct): Promise<Product[]> {
        let result: Product[] = [];
        console.log( search );
        search.name = "%" + search.name + "%";
        search.negotiable = "%" + search.negotiable + "%";
        for(let i = 0; i < search.category.length; i++){
            result = result.concat(
                await this.productRepository.createQueryBuilder("product")
                    .leftJoinAndSelect("product.category", "productCategory")
                    .where("product.name like :name",{name : search.name})
                    .andWhere("product.price >= :minPrice AND product.price <= :maxPrice", {
                        minPrice : search.minPrice !== undefined ? search.minPrice : 0,
                        maxPrice : search.maxPrice !== undefined ? search.maxPrice : 999999999 })
                    .andWhere("product.negotiable like :negotiable", {negotiable : search.negotiable})
                    .andWhere("productCategory.name like :category", {category: "%" + search.category[i] + "%"})
                    .getMany());
            console.log("///////////////////////////");
        }
        return result;
    }
}
