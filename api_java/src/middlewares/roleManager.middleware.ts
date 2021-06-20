import {User} from "../models/user.models";
import {ChecklistManagerController} from "../controllers/checklistManager.controller";
import {OptionManagerController} from "../controllers/optionManager.controller";
import {ColumnManagerController} from "../controllers/columnManager.controller";
import {StickerManagerController} from "../controllers/stickerManager.controller";
import {TaskManagerController} from "../controllers/taskManager.controller";
import {ProjectManagerController} from "../controllers/projectManager.controller";
import {ProjectParticipantManagerController} from "../controllers/projectParticipantManager";
import {ProjectParticipant} from "../models/projectParticipant";
import {Checklist} from "../models/checklist.models";
import {Option} from "../models/option.models";
import {Columns} from "../models/column.models";
import {Sticker} from "../models/sticker.models";
import {Task} from "../models/task.models";
import {Project} from "../models/project.models";

export function roleVerificationBeforeDeleteComponent(componentType: string): (req, res, next) => void {
    return async function (req, res, next) {
        const userId = (req.user as User).id;
        const projectId = req.params.projectId;
        const componentId = (componentType === "project" ? projectId : req.params.component);
        if (componentId === undefined || projectId === undefined) {
            console.log("Le champ component ou projet n'existe pas !");
            res.status(401).end();
            return;
        }
        if (!await doComponentExist(componentType, componentId)) {
            console.log("le component existe pas  !!!! ");
            res.status(401).end();
            return;
        }
        if (!await isUserCreator(userId, componentType, componentId)) {
            if (!await isUserOwner(userId, projectId)) {
                console.log("Vous ne pouvez pas supprimer ce composant !!!! ");
                res.status(401).end();
                return;
            }
        }
        next();
    }
}

async function isUserCreator(userId, type, componentId): Promise<boolean> {
    let componentFind;
    if (type == 'checklist') {
        const controller = await ChecklistManagerController.getInstance();
        componentFind = await controller.getChecklistById(componentId);
        return (componentFind === undefined ? false : (componentFind as Checklist).user.id === userId);
    } else if (type == 'option') {
        const controller = await OptionManagerController.getInstance();
        componentFind = await controller.getOptionById(componentId);
        return (componentFind === undefined ? false : (componentFind as Option).user.id === userId);
    } else if (type == 'column') {
        const controller = await ColumnManagerController.getInstance();
        componentFind = await controller.getColumnById(componentId);
        return (componentFind === undefined ? false : (componentFind as Columns).user.id === userId);
    } else if (type == 'sticker') {
        const controller = await StickerManagerController.getInstance();
        componentFind = await controller.getStickerById(componentId);
        return (componentFind === undefined ? false : (componentFind as Sticker).user.id === userId);
    } else if (type == 'task') {
        const controller = await TaskManagerController.getInstance();
        componentFind = await controller.getTaskById(componentId);
        return (componentFind === undefined ? false : (componentFind as Task).user.id === userId);
    } else if (type == 'project') {
        const controller = await ProjectManagerController.getInstance();
        componentFind = await controller.getProjectById(componentId);
        return (componentFind === undefined ? false : (componentFind as Project).user.id === userId);
    }
}

async function doComponentExist(type, componentId): Promise<boolean> {
    let componentFind;
    if (type === 'checklist') {
        const controller = await ChecklistManagerController.getInstance();
        componentFind = await controller.getChecklistById(componentId);
        return (componentFind !== undefined);
    } else if (type === 'option') {
        const controller = await OptionManagerController.getInstance();
        componentFind = await controller.getOptionById(componentId);
        return (componentFind !== undefined);
    } else if (type === 'column') {
        const controller = await ColumnManagerController.getInstance();
        componentFind = await controller.getColumnById(componentId);
        return (componentFind !== undefined);
    } else if (type === 'sticker') {
        const controller = await StickerManagerController.getInstance();
        componentFind = await controller.getStickerById(componentId);
        return (componentFind !== undefined);
    } else if (type === 'task') {
        const controller = await TaskManagerController.getInstance();
        componentFind = await controller.getTaskById(componentId);
        return (componentFind !== undefined);
    } else if (type === 'project') {
        const controller = await ProjectManagerController.getInstance();
        componentFind = await controller.getProjectById(componentId);
        return (componentFind !== undefined);
    }
}

async function isUserOwner(userId, projectId): Promise<boolean> {
    const projectParticipantController = await ProjectParticipantManagerController.getInstance();
    const userFind = await projectParticipantController.getRegistrationByUserAndProject(userId, projectId);

    return userFind === undefined ? false : (userFind as ProjectParticipant).role === "OWNER";

}
