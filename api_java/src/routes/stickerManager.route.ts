import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {StickerManagerController} from "../controllers/stickerManager.controller";

const stickerManagerRouter = express.Router();

stickerManagerRouter.post("/:projectId/sticker/create", ensureLoggedIn, async function (req, res) {
    const stickerManagerController = await StickerManagerController.getInstance();
    try {
        const sticker = await stickerManagerController.createSticker({...req.body});
        res.status(201).json(sticker);
    } catch (err) {
        res.status(409).send(err).end();
    }
});

stickerManagerRouter.put("/sticker/:stickerId/update", ensureLoggedIn, async function (req, res) {
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

export {
    stickerManagerRouter
}
