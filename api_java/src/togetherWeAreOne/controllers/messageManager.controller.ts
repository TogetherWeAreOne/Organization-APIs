import {getRepository, Not, Repository} from "typeorm";
import {User, UserProps} from "../models/user.models";
import {Message, MessageProps} from "../models/message.models";
import {DiscussionMessage, DiscussionMessageProps} from "../models/discussionMessage.models";
import {DiscussionUser, DiscussionUserProps} from "../models/discussionUser.models";
import {DiscussionUserParticipant, DiscussionUserParticipantProps} from "../models/discussionUserParticpant.models";

export class MessageManagerController {

    private static instance: MessageManagerController;
    private messageRepository: Repository<Message>;
    private discussionRepository: Repository<DiscussionUser>;
    private discussionParticipantRepository: Repository<DiscussionUserParticipant>;

    private constructor() {
        this.messageRepository = getRepository(Message);
        this.discussionRepository = getRepository(DiscussionUser);
        this.discussionParticipantRepository = getRepository(DiscussionUserParticipant);
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

    public async createDiscussion(props: DiscussionUserProps): Promise<DiscussionUser> {
        const discussion = this.discussionRepository.create({
            ...props
        });
        await this.discussionRepository.save(discussion);

        return discussion;
    }

    public async createDiscussionParticipant(props: DiscussionUserParticipantProps): Promise<DiscussionUserParticipant> {
        const discussionParticipant = this.discussionParticipantRepository.create({
            ...props
        });
        await this.discussionParticipantRepository.save(discussionParticipant);

        return discussionParticipant;
    }

    public async getDiscussiontById(discussionId : string): Promise<DiscussionUser>{
        return this.discussionRepository.findOne(discussionId);
    }

    public async getDiscussionParticipantByUser(props : UserProps): Promise<DiscussionUserParticipant[]>{
        return this.discussionParticipantRepository.find({
            where: {user : props},relations: ["user", "discussion"]
        });
    }

    public async getDiscussionParticipantByDiscussion(props : DiscussionUser): Promise<DiscussionUserParticipant[]>{
        return this.discussionParticipantRepository.find({ where: {discussion : props},relations: ["user", "discussion"]});
    }
    public async getInterlocutorByDiscussion(props : DiscussionUser, user : User): Promise<DiscussionUserParticipant>{
        return this.discussionParticipantRepository.findOne({ where: {discussion : props, user : Not(user.id)},relations: ["user", "discussion"]});
    }

    public async getAllMessageByDiscussion(props : DiscussionUser): Promise<Message[]>{
        return this.messageRepository.find({ where : {
            discussion : props}, relations: ["sender"]
        });
    }

    public async updateDiscussion(id: string, props: DiscussionUser) {
        const result = await this.discussionRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
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
