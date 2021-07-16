import {getRepository, Repository} from "typeorm";
import {User} from "../models/user.models";
import {Message, MessageProps} from "../models/message.models";

export class MessageManagerController {

    private static instance: MessageManagerController;
    private userRepository: Repository<User>;
    private messageRepository: Repository<Message>;

    private constructor() {
        this.userRepository = getRepository(User);
        this.messageRepository = getRepository(Message);
    }

    public static async getInstance(): Promise<MessageManagerController> {
        if (MessageManagerController.instance === undefined) {
            MessageManagerController.instance = new MessageManagerController();
        }
        return MessageManagerController.instance;
    }

    public async createMessage(props: MessageProps): Promise<Message> {
        const product = this.messageRepository.create({
            ...props
        });
        await this.messageRepository.save(product);

        return product;
    }

    public async updateMessage(id: string, props: MessageProps) {
        const result = await this.messageRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }



    public async getMessageById(id: string): Promise<Message> {
        return this.messageRepository.findOneOrFail(id);
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getAllMessageByUser(user : User): Promise<Message[]> {
        return this.messageRepository.find( {
            where : [
                {sender: user },
                {receiver: user}
            ]});
    }

    public async getAllMessage(): Promise<Message[]> {
        return this.messageRepository.find();
    }

    public async deleteMessageById(id: string) {
        await this.messageRepository.softDelete(id);
    }
}
