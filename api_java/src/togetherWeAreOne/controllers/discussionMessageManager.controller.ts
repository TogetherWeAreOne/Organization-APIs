import {getRepository, Repository} from "typeorm";
import {Discussion, DiscussionProps} from "../models/discussion.models";
import {DiscussionMessage, DiscussionMessageProps} from "../models/discussionMessage.models";

export class DiscussionMessageManagerController {

    private static instance: DiscussionMessageManagerController;
    private discussionMessageRepository: Repository<DiscussionMessage>;

    private constructor() {

        this.discussionMessageRepository = getRepository(DiscussionMessage);
    }

    public static async getInstance(): Promise<DiscussionMessageManagerController> {
        if (DiscussionMessageManagerController.instance === undefined) {
            DiscussionMessageManagerController.instance = new DiscussionMessageManagerController();
        }
        return DiscussionMessageManagerController.instance;
    }

    public async createDiscussionMessage(props: DiscussionMessageProps): Promise<DiscussionMessage> {
        const discussion = this.discussionMessageRepository.create({
            ...props
        });
        await this.discussionMessageRepository.save(discussion);

        return discussion;
    }

    public async getDiscussionMessageById(id: string): Promise<DiscussionMessage> {
        return this.discussionMessageRepository.findOneOrFail(id,{relations:["creator"]})
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }


    public async getAllDiscussionMessageFromDiscussion(discussion : Discussion): Promise<DiscussionMessage[]> {
        return this.discussionMessageRepository.find( { discussion : discussion });
    }

    public async deleteDiscussionMessageById(id: string) {
        await this.discussionMessageRepository.softDelete(id);
    }
}
