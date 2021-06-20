import {getRepository, Repository} from "typeorm";
import {Project} from "../models/project.models";
import {ColumnProps, Columns} from "../models/column.models";


export class ColumnManagerController {

    private static instance: ColumnManagerController;
    private projectRepository: Repository<Project>;
    private columnsRepository: Repository<Columns>;


    private constructor() {
        this.projectRepository = getRepository(Project);
        this.columnsRepository = getRepository(Columns);
    }

    public static async getInstance(): Promise<ColumnManagerController> {
        if (ColumnManagerController.instance === undefined) {
            ColumnManagerController.instance = new ColumnManagerController();
        }
        return ColumnManagerController.instance;
    }

    public async createColumn(props: ColumnProps): Promise<Columns> {
        const project = this.columnsRepository.create({
            ...props
        });
        await this.columnsRepository.save(project);

        return project;
    }

    public async updateColumn(id: string, props: ColumnProps) {
        const result = await this.columnsRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async getColumnById(id: string): Promise<Columns> {
        return this.columnsRepository.createQueryBuilder("columns")
            .leftJoinAndSelect("columns.user", "columnUser")
            .where("columns.id = :id", {id: id})
            .getOne();
    }

    public async getAllColumnByProject(id): Promise<Columns[]> {
        return this.columnsRepository.find({where: {project: id}});
    }

    public async deleteColumnById(id: string) {
        await this.columnsRepository.softDelete(id);
    }
}
