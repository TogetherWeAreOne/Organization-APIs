import {getRepository, Repository} from "typeorm";
import {AccessCode, AccessCodeProps} from "../models/accesCode.model";
import {Project} from "../models/project.models";


export class AccessCodeManagerController {

    private static instance: AccessCodeManagerController;
    private accessCodeRepository: Repository<AccessCode>;


    private constructor() {
        this.accessCodeRepository = getRepository(AccessCode);
    }

    public static async getInstance(): Promise<AccessCodeManagerController> {
        if (AccessCodeManagerController.instance === undefined) {
            AccessCodeManagerController.instance = new AccessCodeManagerController();
        }
        return AccessCodeManagerController.instance;
    }

    public async createAccessCode(props: AccessCodeProps,project : Project): Promise<AccessCode> {
        console.log(project);
        let accessCode  = this.accessCodeRepository.create({
            ...props,
            project: project
        });

        await this.accessCodeRepository.save(accessCode);
        /*accessCode=await this.accessCodeRepository.save(accessCode);
        await this.accessCodeRepository.createQueryBuilder()
            .relation(Project, "accessCodes")
            .of(projectId)
            .add(accessCode.id);*/
        return accessCode ;
    }

    public async getAccessCodeById(id: string): Promise<AccessCode> {
        return this.accessCodeRepository.findOne(id, {relations : ["project"]});
        /*return this.projectRepository.createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "projectUser")
            .where("project.id = :id", {id: id})
            .getOne();*/
    }

    public async updateAccessCode(id: string, props: AccessCode) {
        const result = await this.accessCodeRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async deleteAccessCodeById(id: string) {
        await this.accessCodeRepository.softDelete(id);
    }
}
