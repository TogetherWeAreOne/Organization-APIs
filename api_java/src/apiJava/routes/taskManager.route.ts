import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {ColumnManagerController} from "../controllers/columnManager.controller";
import {TaskManagerController} from "../controllers/taskManager.controller";
import {ChecklistManagerController} from "../controllers/checklistManager.controller";
import {roleVerificationBeforeDeleteComponent} from "../middlewares/roleManager.middleware";
import {User} from "../models/user.models";

const taskManagerRouter = express.Router();

taskManagerRouter.post("/column/:columnId/task/create", ensureLoggedIn, async function (req, res) {
    const taskManagerController = await TaskManagerController.getInstance();
    const columnManagerController = await ColumnManagerController.getInstance();
    const column = await columnManagerController.getColumnById(req.params.columnId);
    try {
        const task = await taskManagerController.createTask({...req.body, column: column, user: req.user as User});
        res.status(201).json(task);
    } catch (err) {
        res.status(409).send(err).end();
    }
});

taskManagerRouter.put("/task/:taskId/update", ensureLoggedIn, async function (req, res) {
    const taskId = req.params.taskId;
    console.log(taskId);
    const taskManagerController = await TaskManagerController.getInstance();
    if (taskId === undefined) {
        res.status(400).end();
        return;
    }
    try {
        await taskManagerController.updateTask(taskId, {...req.body});
        res.status(204).end();
    } catch (err) {
        res.status(400).send(err).end();
    }
});

taskManagerRouter.get("/column/task/:taskId/get/allChecklist", ensureLoggedIn, async function (req, res) {
    const taskId = req.params.taskId;
    const checklistManagerController = await ChecklistManagerController.getInstance();
    if (taskId === undefined) {
        res.status(400);
        return;
    }
    try {
        const checklists = await checklistManagerController.getAllChecklistByTask(taskId);
        res.status(202).json(checklists);
    } catch (err) {
        res.status(400).send(err).end();
    }
})

taskManagerRouter.delete('/:projectId/column/task/:component/delete', roleVerificationBeforeDeleteComponent("task"), async function (req, res) {
    const taskId = req.params.component;
    const taskManagerController = await TaskManagerController.getInstance();
    try {
        await taskManagerController.deleteTaskById(taskId);
        console.log("la tache a bien été supprimé");
        res.status(200).end();
    } catch (err) {
        res.status(400).send(err).end();
    }
});

export {
    taskManagerRouter
}
