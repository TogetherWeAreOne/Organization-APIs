import {getRepository, Repository} from "typeorm";
import {Sticker, StickerProps} from "../models/sticker.models";

export class StickerManagerController {

    private static instance: StickerManagerController;
    private stickerRepository: Repository<Sticker>;


    private constructor() {
        this.stickerRepository = getRepository(Sticker);
    }

    public static async getInstance(): Promise<StickerManagerController> {
        if (StickerManagerController.instance === undefined) {
            StickerManagerController.instance = new StickerManagerController();
        }
        return StickerManagerController.instance;
    }

    public async createSticker(props: StickerProps): Promise<Sticker> {
        const sticker = this.stickerRepository.create({
            ...props
        });
        await this.stickerRepository.save(sticker);

        return sticker;
    }

    public async updateSticker(id: string, props: StickerProps) {
        const result = await this.stickerRepository.update(id, props);
        return !(result.affected === undefined || result.affected <= 0);
    }

    public async getStickerById(id: string): Promise<Sticker> {
        return this.stickerRepository.createQueryBuilder("sticker")
            .leftJoinAndSelect("sticker.user", "stickerUser")
            .where("sticker.id = :id", {id: id})
            .getOne();
    }

    public async getAllStickers(): Promise<Sticker[]> {
        return this.stickerRepository.find();
    }

    public async deleteStickerById(id: string) {
        await this.stickerRepository.softDelete(id);
    }

}
