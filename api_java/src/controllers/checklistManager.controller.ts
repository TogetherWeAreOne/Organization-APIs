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
            ...props
        });
        await this.checklistRepository.save(checklist);

        return checklist;
    }

    public async updateChecklist(id: string, props: ChecklistProps) {
        const result = await this.checklistRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async getChecklistById(id: string): Promise<Checklist> {
        return this.checklistRepository.findOneOrFail(id);
    }

}
