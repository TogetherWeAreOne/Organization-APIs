import {getRepository, Repository} from "typeorm";
import {User, UserProps} from "../models/user.models";


export class UserManagerController {

    private static instance: UserManagerController;
    private userRepository: Repository<User>;

    private constructor() {
        this.userRepository = getRepository(User);
    }

    public static async getInstance(): Promise<UserManagerController> {
        if (UserManagerController.instance === undefined) {
            UserManagerController.instance = new UserManagerController();
        }
        return UserManagerController.instance;
    }

    public async updateUser(id: string, props: UserProps) {
        const result = await this.userRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async getUserById(id: string): Promise<User> {
        return this.userRepository.findOne(id)
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getAllUser(): Promise<User[]> {
        return this.userRepository.find();
    }

    public async searchUser(pseudo : string): Promise<User[]> {
        pseudo = "%" + pseudo + "%";
        return await this.userRepository.createQueryBuilder("user")
            .where("user.pseudo like :pseudo",{pseudo : pseudo})
            .limit(5)
            .getMany();
    }

    public async deleteUserById(id: string) {
        await this.userRepository.softDelete(id);
    }
}
