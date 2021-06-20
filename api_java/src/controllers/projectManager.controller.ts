import {User} from "../models/user.models";
import {getRepository, Repository} from "typeorm";
import {Project, ProjectProps} from "../models/project.models";
import {ProjectParticipant} from "../models/projectParticipant";


export class ProjectManagerController {

    private static instance: ProjectManagerController;
    private userRepository: Repository<User>;
    private projectRepository: Repository<Project>;
    private projectParticipant: Repository<ProjectParticipant>;


    private constructor() {
        this.userRepository = getRepository(User);
        this.projectRepository = getRepository(Project);
        this.projectParticipant = getRepository(ProjectParticipant);
    }

    public static async getInstance(): Promise<ProjectManagerController> {
        if (ProjectManagerController.instance === undefined) {
            ProjectManagerController.instance = new ProjectManagerController();
        }
        return ProjectManagerController.instance;
    }

    public async createProject(props: ProjectProps): Promise<Project> {
        const project = this.projectRepository.create({
            ...props
        });
        await this.projectRepository.save(project);

        return project;
    }

    public async updateProject(id: string, props: ProjectProps) {
        const result = await this.projectRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async getUserById(id: string): Promise<User> {
        return this.userRepository.findOneOrFail(id);
    }

    public async getProjectById(id: string): Promise<Project> {
        return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", { id: id })
            .getOne();
    }

    public async getAllProject(): Promise<Project[]> {
        return this.projectRepository.find();
    }

    public async deleteProjectById(id: string) {
        await this.projectRepository.softDelete(id);
    }

}
