import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";

import {ProjectManagerController} from "../controllers/projectManager.controller";
import {User} from "../models/user.models";

const projectManagerRouter = express.Router();


projectManagerRouter.post("/create", ensureLoggedIn, async function (req, res) {
    const projectManagerController = await ProjectManagerController.getInstance();
    const user = await projectManagerController.getUserById((req.user as User).id);
    try {
        const project = await projectManagerController.createProject({...req.body, user: (req.user as User)});
        const participant = await projectManagerController.addUserToProject({
            pseudo: (req.user as User).firstname,
            user: (req.user as User),
            project
        });
        res.status(201).json(project && participant);
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

export {
    projectManagerRouter
}
