import {getRepository, Repository} from "typeorm";
import {User} from "../models/user.models";
import {Event} from "../models/event.models";
import {EventProps} from "../models/event.models";

export class EventManagerController {

    private static instance: EventManagerController;
    private userRepository: Repository<User>;
    private eventRepository: Repository<Event>;

    private constructor() {
        this.userRepository = getRepository(User);
        this.eventRepository = getRepository(Event);
    }

    public static async getInstance(): Promise<EventManagerController> {
        if (EventManagerController.instance === undefined) {
            EventManagerController.instance = new EventManagerController();
        }
        return EventManagerController.instance;
    }

    public async createEvent(props: EventProps): Promise<Event> {
        const event = this.eventRepository.create({
            ...props
        });
        await this.eventRepository.save(event);

        return event;
    }

    public async updateEvent(id: string, props: EventProps) {
        const result = await this.eventRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async getEventById(id: string): Promise<Event> {
        return this.eventRepository.findOneOrFail(id,{relations:["user"]})
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getEventByCreator(user: User): Promise<Event[]> {
        return this.eventRepository.find({creator: user});
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getAllEvent(): Promise<Event[]> {
        return this.eventRepository.find();
    }

    public async deleteEventById(id: string) {
        await this.eventRepository.softDelete(id);
    }
}
