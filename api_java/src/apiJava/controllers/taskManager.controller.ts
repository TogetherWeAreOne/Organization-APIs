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
            ...props,
            state: "NOT_STARTED"
        });
        await this.taskRepository.save(task);

        return task;
    }

    public async updateTask(id: string, props: TaskProps) {
        const result = await this.taskRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async getTaskById(id: string): Promise<Task> {
        return this.taskRepository.createQueryBuilder("task")
            .leftJoinAndSelect("task.user", "taskUser")
            .where("task.id = :id", {id: id})
            .getOne();
    }

    public async getAllTaskByColumn(id): Promise<Task[]> {
        return this.taskRepository.find({where: {column: id}});
    }

    public async deleteTaskById(id: string) {
        await this.taskRepository.softDelete(id);
    }

}
