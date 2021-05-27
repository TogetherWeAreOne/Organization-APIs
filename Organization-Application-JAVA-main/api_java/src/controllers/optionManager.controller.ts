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
            ...props
        });
        await this.optionRepository.save(option);

        return option;
    }

    public async updateOption(id: string, props: OptionsProps) {
        const result = await this.optionRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async getOptionById(id: string): Promise<Option> {
        return this.optionRepository.findOneOrFail(id);
    }

}
