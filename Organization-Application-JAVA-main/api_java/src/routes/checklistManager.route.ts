import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {TaskManagerController} from "../controllers/taskManager.controller";
import {ChecklistManagerController} from "../controllers/checklistManager.controller";

const checklistManagerRouter = express.Router();

checklistManagerRouter.post("/:projectId/column/:columnId/task/:taskId/checklist/create", ensureLoggedIn, async function (req, res) {
    const taskManagerController = await TaskManagerController.getInstance();
    const checklistManagerController = await ChecklistManagerController.getInstance();
    const task = await taskManagerController.getTaskById(req.params.taskId);
    try {
        const checklist = await checklistManagerController.createChecklist({...req.body, task: task});
        res.status(201).json(task && checklist);
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

export {
    checklistManagerRouter
}
