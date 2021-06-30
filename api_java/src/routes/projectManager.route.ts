import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";

import {ProjectManagerController} from "../controllers/projectManager.controller";
import {User} from "../models/user.models";
import {ColumnManagerController} from "../controllers/columnManager.controller";
import {roleVerificationBeforeDeleteComponent} from "../middlewares/roleManager.middleware";
import {ProjectParticipantManagerController} from "../controllers/projectParticipantManager";

const projectManagerRouter = express.Router();


projectManagerRouter.post("/create", ensureLoggedIn, async function (req, res) {
    const projectManagerController = await ProjectManagerController.getInstance();
    const projectParticipantManagerController = await ProjectParticipantManagerController.getInstance();
    try {
        const project = await projectManagerController.createProject({...req.body, user: (req.user as User)});
        await projectParticipantManagerController.addOwnerToProject({
            pseudo: (req.user as User).firstname,
            user: (req.user as User),
            role: "OWNER",
            project
        });
        res.status(201).json(project);
    } catch (err) {
        res.status(409).send(err).end();
    }
});

projectManagerRouter.put("/update/:projectId", ensureLoggedIn, async function (req, res) {
    const projectId = req.params.projectId;
    const projectManagerController = await ProjectManagerController.getInstance();
    if (projectId === undefined) {
        res.status(400).end();
        return;
    }
    try {
        await projectManagerController.updateProject(projectId, {...req.body});
        res.status(204).end();
    } catch (err) {
        res.status(400).send(err).end();
    }
});

projectManagerRouter.get("/allColumns/:projectId", ensureLoggedIn, async function (req, res) {
    const projectId = req.params.projectId;
    const columnManager = await ColumnManagerController.getInstance();
    if (projectId === undefined) {
        res.status(400);
        return;
    }
    try {
        const columns = await columnManager.getAllColumnByProject(projectId);
        res.status(202).json(columns);
    } catch (err) {
        res.status(400).send(err).end();
    }
})

projectManagerRouter.get("/all/:userId", ensureLoggedIn, async function (req, res) {
    const userId = req.params.userId;
    const projectManagerController = await ProjectManagerController.getInstance();
    try {
        const projects = await projectManagerController.getAllProjectForUser(userId);
        res.status(202).json(projects);
    } catch (err) {
        res.status(400).send(err).end();
    }
})

projectManagerRouter.get("/all", ensureLoggedIn, async function (req, res) {
    const projectManagerController = await ProjectManagerController.getInstance();
    try {
        const projects = await projectManagerController.getAllProject();
        res.status(202).json(projects);
    } catch (err) {
        res.status(400).send(err).end();
    }
})



//
projectManagerRouter.delete('/delete/:projectId', roleVerificationBeforeDeleteComponent("project"), async function (req, res) {
    const projectId = req.params.projectId;
    const projectManagerController = await ProjectManagerController.getInstance();
    try {
        await projectManagerController.deleteProjectById(projectId);
        res.status(200).end();
    } catch (err) {
        res.status(400).send(err).end();
    }
});

export {
    projectManagerRouter
}
