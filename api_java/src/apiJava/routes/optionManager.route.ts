import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {ChecklistManagerController} from "../controllers/checklistManager.controller";
import {OptionManagerController} from "../controllers/optionManager.controller";
import {roleVerificationBeforeDeleteComponent} from "../middlewares/roleManager.middleware";
import {User} from "../models/user.models";

const optionManagerRouter = express.Router();

optionManagerRouter.post("/create/:checklistId", ensureLoggedIn, async function (req, res) {
    const checklistManagerController = await ChecklistManagerController.getInstance();
    const optionManagerController = await OptionManagerController.getInstance();
    const checklist = await checklistManagerController.getChecklistById(req.params.checklistId);
    try {
        await optionManagerController.createOption({
            ...req.body,
            checklist: checklist,
            user: req.user as User
        });
        res.status(201).json(checklist);
    } catch (err) {
        res.status(409).send(err).end();
    }
});

optionManagerRouter.put("/update/:optionId", ensureLoggedIn, async function (req, res) {
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

optionManagerRouter.delete('/delete/:component/:projectId', roleVerificationBeforeDeleteComponent("option"), async function (req, res) {
    const optionId = req.params.component;
    const optionManagerController = await OptionManagerController.getInstance();
    try {
        await optionManagerController.deleteOptionById(optionId);
        res.status(200).end();
    } catch (err) {
        res.status(400).send(err).end();
    }
});


export {
    optionManagerRouter
}
