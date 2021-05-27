import {getRepository, Repository} from "typeorm";
import {Columns} from "../models/column.models";
import {Task, TaskProps} from "../models/task.models";

export class TaskManagerController {

    private static instance: TaskManagerController;
    private taskRepository: Repository<Task>;
    private columnsRepository: Repository<Columns>;


    private constructor() {
        this.taskRepository = getRepository(Task);
        this.columnsRepository = getRepository(Columns);
    }

    public static async getInstance(): Promise<TaskManagerController> {
        if (TaskManagerController.instance === undefined) {
            TaskManagerController.instance = new TaskManagerController();
        }
        return TaskManagerController.instance;
    }

    public async createTask(props: TaskProps): Promise<Task> {
        const task = this.taskRepository.create({
            ...props
        });
        await this.taskRepository.save(task);

        return task;
    }

    public async updateTask(id: string, props: TaskProps) {
        const result = await this.taskRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async getTaskById(id: string): Promise<Task> {
        return this.taskRepository.findOneOrFail(id);
    }

}
