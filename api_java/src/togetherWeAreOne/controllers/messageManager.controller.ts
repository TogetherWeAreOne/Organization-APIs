import {getRepository, Repository} from "typeorm";
import {User} from "../models/user.models";
import {Message, MessageProps} from "../models/message.models";
import {DiscussionMessage, DiscussionMessageProps} from "../models/discussionMessage.models";

export class MessageManagerController {

    private static instance: MessageManagerController;
    private messageRepository: Repository<Message>;

    private constructor() {
        this.messageRepository = getRepository(Message);
    }

    public static async getInstance(): Promise<MessageManagerController> {
        if (MessageManagerController.instance === undefined) {
            MessageManagerController.instance = new MessageManagerController();
        }
        return MessageManagerController.instance;
    }

    public async createMessage(props: MessageProps): Promise<Message> {
        const message = this.messageRepository.create({
            ...props
        });
        await this.messageRepository.save(message);

        return message;
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
