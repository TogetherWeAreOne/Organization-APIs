import {getRepository, Repository} from "typeorm";
import {User} from "../models/user.models";
import {Event, EventProps} from "../models/event.models";
import {Discussion, DiscussionProps} from "../models/discussion.models";

export class DiscussionManagerController {

    private static instance: DiscussionManagerController;
    private discussionRepository: Repository<Discussion>;

    private constructor() {

        this.discussionRepository = getRepository(Discussion);
    }

    public static async getInstance(): Promise<DiscussionManagerController> {
        if (DiscussionManagerController.instance === undefined) {
            DiscussionManagerController.instance = new DiscussionManagerController();
        }
        return DiscussionManagerController.instance;
    }

    public async createDiscussion(props: DiscussionProps): Promise<Discussion> {
        const discussion = this.discussionRepository.create({
            ...props
        });
        await this.discussionRepository.save(discussion);

        return discussion;
    }

    public async updateDiscussion(id: string, props: DiscussionProps) {
        const result = await this.discussionRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async getDiscussionById(id: string): Promise<Discussion> {
        return this.discussionRepository.findOneOrFail(id,{relations:["event"]})
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getDiscussionByEvent(event: Event): Promise<Discussion> {
        return this.discussionRepository.findOneOrFail({event: event});
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }


    public async getAllDiscussion(): Promise<Discussion[]> {
        return this.discussionRepository.find();
    }

    public async deleteDiscussionById(id: string) {
        await this.discussionRepository.softDelete(id);
    }
}
