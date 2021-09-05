import {getRepository, IsNull, Not, Repository} from "typeorm";
import {User} from "../models/user.models";
import {Event, EventProps} from "../models/event.models";
import {EventParticipant, EventParticipantProps} from "../models/eventParticipant.models";

export class EventParticipantManagerController {

    private static instance: EventParticipantManagerController;
    private eventParticipantRepository: Repository<EventParticipant>;
    private eventRepository: Repository<Event>;

    private constructor() {
        this.eventParticipantRepository = getRepository(EventParticipant);
        this.eventRepository = getRepository(Event);
    }

    public static async getInstance(): Promise<EventParticipantManagerController> {
        if (EventParticipantManagerController.instance === undefined) {
            EventParticipantManagerController.instance = new EventParticipantManagerController();
        }
        return EventParticipantManagerController.instance;
    }

    public async addUserToEvent(props: EventParticipantProps): Promise<EventParticipant> {
        const eventParticipant = this.eventParticipantRepository.create({
            ...props,
        });
        await this.eventParticipantRepository.save(eventParticipant);

        return eventParticipant;
    }

    public async getAllEventParticipantByEvent(event : Event): Promise<EventParticipant[]> {
        return this.eventParticipantRepository.find({where: {event : event},relations: ["user"]})
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getAllEventParticipantByUser(user: User): Promise<EventParticipant[]> {
        return this.eventParticipantRepository.find( { where: {user : user},relations: ["event"]});
        /*return this.eventParticipantRepository.createQueryBuilder("eventParticipant")
            .leftJoinAndSelect("eventParticipant.event", "event")
            .where("eventParticipant.user = :user", {user: user.id})
            .where("event.deletedAt = :delete", {delete: null})
            .getMany();
           */
    }

    public async leaveEvent(event: Event, user: User) {
        await this.eventParticipantRepository.delete({event : event, user: user});
    }
}
