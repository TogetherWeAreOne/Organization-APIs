import {getRepository, Repository} from "typeorm";
import {Task} from "../models/task.models";
import {Checklist, ChecklistProps} from "../models/checklist.models";

export class ChecklistManagerController {

    private static instance: ChecklistManagerController;
    private taskRepository: Repository<Task>;
    private checklistRepository: Repository<Checklist>;


    private constructor() {
        this.taskRepository = getRepository(Task);
        this.checklistRepository = getRepository(Checklist);
    }

    public static async getInstance(): Promise<ChecklistManagerController> {
        if (ChecklistManagerController.instance === undefined) {
            ChecklistManagerController.instance = new ChecklistManagerController();
        }
        return ChecklistManagerController.instance;
    }

    public async createChecklist(props: ChecklistProps): Promise<Checklist> {
        const checklist = this.checklistRepository.create({
            ...props,
            state: "NOT_STARTED",
            percentage: 0
        });
        await this.checklistRepository.save(checklist);

        return checklist;
    }

    public async updateChecklist(id: string, props: ChecklistProps) {
        let entity = new Checklist()
        entity.title = props.title;
        entity.percentage = props.percentage;
        entity.state = props.state;
        const result = await this.checklistRepository.update(id, entity);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async getChecklistById(id: string): Promise<Checklist> {
        return this.checklistRepository.createQueryBuilder("checklist")
            .leftJoinAndSelect("checklist.user", "checklistUser")
            .where("checklist.id = :id", {id: id})
            .getOne();
    }

    public async getAllChecklistByTask(id): Promise<Checklist[]> {
        return this.checklistRepository.find({where: {task: id}});
    }

    public async deleteChecklistById(id: string) {
        await this.checklistRepository.softDelete(id);

    }

}
