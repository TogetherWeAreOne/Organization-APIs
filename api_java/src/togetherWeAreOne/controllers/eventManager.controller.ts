import {getRepository, Repository} from "typeorm";
import {User} from "../models/user.models";
import {Event} from "../models/event.models";
import {EventProps} from "../models/event.models";
import {SearchProduct} from "../models/searchProduct.models";
import {Product} from "../models/product.models";
import {SearchEvent} from "../models/searchEvent.model";

var moment = require('moment');
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
        return this.eventRepository.findOneOrFail(id,{relations:["creator"]})
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async getEventByCreator(user: User): Promise<Event[]> {
        return this.eventRepository.find({where : { creator: user }, withDeleted : true});
    }

    public async getAllEvent(): Promise<Event[]> {
        return this.eventRepository.find({relations:["creator"]});
    }

    public async deleteEventById(id: string) {
        await this.eventRepository.softDelete(id);
    }

    public async getEventBySearch(search : SearchEvent): Promise<Event[]> {
        let result: Event[] = [];
        search.title = "%" + search.title + "%";
        search.eventType = "%" + search.eventType + "%";
        console.log(':::::::::::::::::::::::::');
        console.log(search.startDate.toString());
        console.log(search.zip+'[0-9]{3}')
        console.log(search.startDate);
        console.log(typeof search.startDate);
        search.startDate =  search.startDate.toString() === "" ? search.startDate = undefined : search.startDate;
            result =
                await this.eventRepository.createQueryBuilder("event")
                    .where("event.title like :title",{title : search.title})
                    .andWhere("event.startDate >= :startDate ", {
                        startDate : search.startDate !== undefined ? search.startDate : new Date()})
                    .andWhere("event.eventType like :eventType", {eventType : search.eventType})
                    .andWhere("event.zip regexp :zip ", {zip : search.zip === '' ? '[0-9]{5}' : search.zip + '[0-9]{3}'})
                    .getMany();
            console.log("///////////////////////////");

        return result;
    }
}
