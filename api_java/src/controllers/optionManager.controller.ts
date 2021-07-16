import {getRepository, Repository} from "typeorm";
import {Checklist} from "../models/checklist.models";
import {Option, OptionsProps} from "../models/option.models";

export class OptionManagerController {

    private static instance: OptionManagerController;
    private optionRepository: Repository<Option>;
    private checklistRepository: Repository<Checklist>;


    private constructor() {
        this.optionRepository = getRepository(Option);
        this.checklistRepository = getRepository(Checklist);
    }

    public static async getInstance(): Promise<OptionManagerController> {
        if (OptionManagerController.instance === undefined) {
            OptionManagerController.instance = new OptionManagerController();
        }
        return OptionManagerController.instance;
    }

    public async createOption(props: OptionsProps): Promise<Option> {
        const option = this.optionRepository.create({
            ...props,
            state: "NOT_STARTED"
        });
        await this.optionRepository.save(option);

        return option;
    }

    public async updateOption(id: string, props: OptionsProps) {
        let entity = new Option()
        entity.title = props.title;
        entity.state = props.state;
        const result = await this.optionRepository.update(id, entity);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async getOptionById(id: string): Promise<Option> {
        return this.optionRepository.createQueryBuilder("option")
            .leftJoinAndSelect("option.user", "optionUser")
            .where("option.id = :id", {id: id})
            .getOne();
    }

    public async getAllOptionByChecklist(id): Promise<Option[]> {
        return this.optionRepository.find({where: {checklist: id}});
    }

    public async deleteOptionById(id: string) {
        await this.optionRepository.softDelete(id);
    }
}
