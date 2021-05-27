import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {ChecklistManagerController} from "../controllers/checklistManager.controller";
import {OptionManagerController} from "../controllers/optionManager.controller";

const optionManagerRouter = express.Router();

optionManagerRouter.post("/:projectId/column/:columnId/task/:taskId/checklist/:checklistId/option/create", ensureLoggedIn, async function (req, res) {
    const checklistManagerController = await ChecklistManagerController.getInstance();
    const optionManagerController = await OptionManagerController.getInstance();
    const checklist = await checklistManagerController.getChecklistById(req.params.checklistId);
    try {
        const option = await optionManagerController.createOption({...req.body, checklist: checklist});
        res.status(201).json(checklist && option);
    } catch (err) {
        res.status(409).send(err).end();
    }
});

optionManagerRouter.put("/option/:optionId/update", ensureLoggedIn, async function (req, res) {
    const optionId = req.params.optionId;
    const optionManagerController = await OptionManagerController.getInstance();
    if (optionId === undefined) {
        res.status(400).end();
        return;
    }
    try {
        await optionManagerController.updateOption(optionId, {...req.body});
        res.status(204).end();
    } catch (err) {
        res.status(400).send(err).end();
    }
});


export {
    optionManagerRouter
}
