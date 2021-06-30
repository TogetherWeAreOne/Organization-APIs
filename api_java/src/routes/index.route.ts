import {Express, Router} from "express";
import {authRouter} from "./auth.route";
import {projectManagerRouter} from "./projectManager.route";
import {columnManagerRouter} from "./columnManager.route";
import {taskManagerRouter} from "./taskManager.route";
import {checklistManagerRouter} from "./checklistManager.route";
import {optionManagerRouter} from "./optionManager.route";
import {stickerManagerRouter} from "./stickerManager.route";

export function buildOrgAppRoutes() {
    const router = Router();

    router.use("/auth", authRouter);
    router.use("/project", projectManagerRouter);
    router.use("/column", columnManagerRouter);
    router.use("/task", taskManagerRouter);
    router.use("/checklist", checklistManagerRouter);
    router.use("/option", optionManagerRouter);
    router.use("/sticker", stickerManagerRouter);

    return router;
}


export function buildRoutes(app: Express) {
    app.use("/organisation-app", buildOrgAppRoutes());

}


