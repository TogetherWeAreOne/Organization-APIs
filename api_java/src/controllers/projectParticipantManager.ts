import {getRepository, Repository} from "typeorm";
import {ProjectParticipant, ProjectParticipantProps} from "../models/projectParticipant";


export class ProjectParticipantManagerController {

    private static instance: ProjectParticipantManagerController;
    private projectParticipant: Repository<ProjectParticipant>;


    private constructor() {
        this.projectParticipant = getRepository(ProjectParticipant);
    }

    public async addOwnerToProject(props: ProjectParticipantProps): Promise<ProjectParticipant> {
        const projectParticipant = this.projectParticipant.create({
            ...props
        });
        await this.projectParticipant.save(projectParticipant);

        return projectParticipant;
    }

    public async addUserToProject(props: ProjectParticipantProps): Promise<ProjectParticipant> {
        const projectParticipant = this.projectParticipant.create({
            ...props
        });
        await this.projectParticipant.save(projectParticipant);

        return projectParticipant;
    }

    public static async getInstance(): Promise<ProjectParticipantManagerController> {
        if (ProjectParticipantManagerController.instance === undefined) {
            ProjectParticipantManagerController.instance = new ProjectParticipantManagerController();
        }
        return ProjectParticipantManagerController.instance;
    }

    public async getRegistrationByUserAndProject(userId: string, projectId: string): Promise<ProjectParticipant> {
        return this.projectParticipant.findOne({
            where: {
                user: userId,
                project : projectId
            }
        }
        );
    }
}
