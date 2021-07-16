import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";

import {ProjectManagerController} from "../controllers/projectManager.controller";
import {User} from "../models/user.models";
import {ColumnManagerController} from "../controllers/columnManager.controller";
import {roleVerificationBeforeDeleteComponent} from "../middlewares/roleManager.middleware";
import {ProjectParticipantManagerController} from "../controllers/projectParticipantManager";
import {AccessCodeManagerController} from "../controllers/accessCodeManager.controller";


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

projectManagerRouter.post("/:projectId/code/create", ensureLoggedIn, async function (req, res) {
    const remainingUse = req.body.use;
    const projectId = req.params.projectId;
    const accessCodeManagerController = await AccessCodeManagerController.getInstance();
    const projectManagercontroller = await ProjectManagerController.getInstance();
    const project = await projectManagercontroller.getProjectById(projectId);
    try {
        const code = await accessCodeManagerController.createAccessCode({remainingUse: remainingUse , state:"UNUSED"}, project);
        res.status(201).json(code);
    } catch (err) {
        console.log(err)
        res.status(409).send(err);
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

projectManagerRouter.put("/join/:accessCodeId", ensureLoggedIn, async function (req, res) {
    const accessCodeId = req.params.accessCodeId;
    const accessCodeIdManagerController = await AccessCodeManagerController.getInstance();
    const projectParticipantManagerController = await ProjectParticipantManagerController.getInstance();
    const projectManagerController = await ProjectManagerController.getInstance();
    if (accessCodeId === undefined) {
        res.status(400).end();
        return;
    }
    try {
        console.log("/////////////////////////////////////////////////////////");
        let accessCode = await accessCodeIdManagerController.getAccessCodeById(accessCodeId);
        if (accessCode === undefined){
            res.status(400).end();
            return;
        }
        console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::::::  " + accessCode.project.id);
        const project = await projectManagerController.getProjectById(accessCode.project.id);
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  " + project);
        const addToProject = await projectParticipantManagerController.addUserToProject({
            pseudo : (req.user as User).pseudo,
            role : "GUEST",
            user : (req.user as User),
            project
        });
        accessCode.remainingUse = accessCode.remainingUse-1;
        await accessCodeIdManagerController.updateAccessCode(accessCode.id, accessCode);
        if(accessCode.remainingUse === 0){
            await accessCodeIdManagerController.deleteAccessCodeById(accessCode.id);
        }
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
