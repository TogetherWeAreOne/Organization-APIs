import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {ColumnManagerController} from "../controllers/columnManager.controller";
import {ProjectManagerController} from "../controllers/projectManager.controller";

const columnManagerRouter = express.Router();

columnManagerRouter.post("/:projectId/column/create", ensureLoggedIn, async function (req, res) {
    const columnManagerController = await ColumnManagerController.getInstance();
    const projectManagerController = await ProjectManagerController.getInstance();
    const project = await projectManagerController.getProjectById(req.params.projectId);
    try {
        const column = await columnManagerController.createColumn({...req.body, project: project});
        res.status(201).json(column && project);
    } catch (err) {
        res.status(409).send(err).end();
    }
});

columnManagerRouter.put("/column/:columnId/update", ensureLoggedIn, async function (req, res) {
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

export {
    columnManagerRouter
}

