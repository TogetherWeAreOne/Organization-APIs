import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {TaskManagerController} from "../controllers/taskManager.controller";
import {ChecklistManagerController} from "../controllers/checklistManager.controller";
import {OptionManagerController} from "../controllers/optionManager.controller";
import {roleVerificationBeforeDeleteComponent} from "../middlewares/roleManager.middleware";
import {User} from "../models/user.models";

const checklistManagerRouter = express.Router();

checklistManagerRouter.post("/column/task/:taskId/checklist/create", ensureLoggedIn, async function (req, res) {
    const taskManagerController = await TaskManagerController.getInstance();
    const checklistManagerController = await ChecklistManagerController.getInstance();
    const task = await taskManagerController.getTaskById(req.params.taskId);
    try {
        const checklist = await checklistManagerController.createChecklist({
            ...req.body,
            task: task,
            user: req.user as User
        });
        res.status(201).json(checklist);
    } catch (err) {
        res.status(409).send(err).end();
    }
});

checklistManagerRouter.put("/checklist/:checklistId/update", ensureLoggedIn, async function (req, res) {
    const checklistId = req.params.checklistId;
    const taskManagerController = await ChecklistManagerController.getInstance();
    if (checklistId === undefined) {
        res.status(400).end();
        return;
    }
    try {
        await taskManagerController.updateChecklist(checklistId, {...req.body});
        res.status(204).end();
    } catch (err) {
        res.status(400).send(err).end();
    }
});

checklistManagerRouter.get("/column/task/checklist/:checklistId/get/allOptions", ensureLoggedIn, async function (req, res) {
    const checklistId = req.params.checklistId;
    const optionManagerController = await OptionManagerController.getInstance();
    if (checklistId === undefined) {
        res.status(400);
        return;
    }
    try {
        const checklists = await optionManagerController.getAllOptionByChecklist(checklistId);
        res.status(202).json(checklists);
    } catch (err) {
        res.status(400).send(err).end();
    }
})

checklistManagerRouter.delete('/:projectId/column/task/checklist/:component/delete', roleVerificationBeforeDeleteComponent("checklist"), async function (req, res) {
    const checklistId = req.params.component;
    const checklistManagerController = await ChecklistManagerController.getInstance();
    try {
        await checklistManagerController.deleteChecklistById(checklistId);
        console.log("la checklist a bien été supprimé");
        res.status(200).end();
    } catch (err) {
        res.status(400).send(err).end();
    }
});

export {
    checklistManagerRouter
}
