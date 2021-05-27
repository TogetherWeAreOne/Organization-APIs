import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {ColumnManagerController} from "../controllers/columnManager.controller";
import {TaskManagerController} from "../controllers/taskManager.controller";

const taskManagerRouter = express.Router();

taskManagerRouter.post("/:projectId/column/:columnId/task/create", ensureLoggedIn, async function (req, res) {
    const taskManagerController = await TaskManagerController.getInstance();
    const columnManagerController = await ColumnManagerController.getInstance();
    const column = await columnManagerController.getColumnById(req.params.columnId);
    try {
        const task = await taskManagerController.createTask({...req.body, column: column});
        res.status(201).json(task && column);
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

export {
    taskManagerRouter
}
