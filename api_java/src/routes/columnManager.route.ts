import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {ColumnManagerController} from "../controllers/columnManager.controller";
import {ProjectManagerController} from "../controllers/projectManager.controller";
import {TaskManagerController} from "../controllers/taskManager.controller";
import {roleVerificationBeforeDeleteComponent} from "../middlewares/roleManager.middleware";
import {User} from "../models/user.models";

const columnManagerRouter = express.Router();

columnManagerRouter.post("/create/:projectId", ensureLoggedIn, async function (req, res) {
    const columnManagerController = await ColumnManagerController.getInstance();
    const projectManagerController = await ProjectManagerController.getInstance();
    const project = await projectManagerController.getProjectById(req.params.projectId);
    try {
        const column = await columnManagerController.createColumn({
            ...req.body,
            project: project,
            user: req.user as User
        });
        res.status(201).json(column);
    } catch (err) {
        res.status(409).send(err).end();
    }
});

columnManagerRouter.put("/update/:columnId", ensureLoggedIn, async function (req, res) {
    const columnId = req.params.columnId;
    const columnsManagerController = await ColumnManagerController.getInstance();
    if (columnId === undefined) {
        res.status(400).end();
        return;
    }
    try {
        await columnsManagerController.updateColumn(columnId, {...req.body});
        res.status(204).end();
    } catch (err) {
        res.status(400).send(err).end();
    }
});

columnManagerRouter.get("/allTasks/:columnId", ensureLoggedIn, async function (req, res) {
    const columnId = req.params.columnId;
    const taskManagerController = await TaskManagerController.getInstance();
    if (columnId === undefined) {
        res.status(400);
        return;
    }
    try {
        const tasks = await taskManagerController.getAllTaskByColumn(columnId);
        res.status(202).json(tasks);
    } catch (err) {
        res.status(400).send(err).end();
    }
})

columnManagerRouter.delete('/delete/:columnId/:projectId', roleVerificationBeforeDeleteComponent("column"), async function (req, res) {
    const columnId = req.params.columnId;
    const columnManagerController = await ColumnManagerController.getInstance();
    try {
        await columnManagerController.deleteColumnById(columnId);
        res.status(200).end();
    } catch (err) {
        res.status(400).send(err).end();
    }
});

export {
    columnManagerRouter
}

