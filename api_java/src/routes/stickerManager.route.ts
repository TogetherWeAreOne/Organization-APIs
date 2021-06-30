import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {StickerManagerController} from "../controllers/stickerManager.controller";
import {roleVerificationBeforeDeleteComponent} from "../middlewares/roleManager.middleware";
import {User} from "../models/user.models";

const stickerManagerRouter = express.Router();

stickerManagerRouter.post("/create/:projectId", ensureLoggedIn, async function (req, res) {
    const stickerManagerController = await StickerManagerController.getInstance();
    try {
        const sticker = await stickerManagerController.createSticker({...req.body, user: req.user as User});
        res.status(201).json(sticker);
    } catch (err) {
        res.status(409).send(err).end();
    }
});

stickerManagerRouter.put("/update/:stickerId", ensureLoggedIn, async function (req, res) {
    const stickerId = req.params.stickerId;
    const stickerManagerController = await StickerManagerController.getInstance();
    if (stickerId === undefined) {
        res.status(400).end();
        return;
    }
    try {
        await stickerManagerController.updateSticker(stickerId, {...req.body});
        res.status(204).end();
    } catch (err) {
        res.status(400).send(err).end();
    }
});

stickerManagerRouter.get("/all", ensureLoggedIn, async function (req, res) {
    const stickerManagerController = await StickerManagerController.getInstance();
    try {
        const stickers = await stickerManagerController.getAllStickers();
        res.status(202).json(stickers);
    } catch (err) {
        res.status(400).send(err).end();
    }
})

stickerManagerRouter.delete('/delete/:stickerId/:projectId', roleVerificationBeforeDeleteComponent("sticker"), async function (req, res) {
    const stickerId = req.params.stickerId;
    const stickerManagerController = await StickerManagerController.getInstance();
    try {
        await stickerManagerController.deleteStickerById(stickerId);
        res.status(200).end();
    } catch (err) {
        res.status(400).send(err).end();
    }
});

export {
    stickerManagerRouter
}
