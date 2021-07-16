import {Express, Router} from "express";
import {authRouter} from "./auth.route";
import {projectManagerRouter} from "./projectManager.route";
import {columnManagerRouter} from "./columnManager.route";
import {taskManagerRouter} from "./taskManager.route";
import {checklistManagerRouter} from "./checklistManager.route";
import {optionManagerRouter} from "./optionManager.route";
import {stickerManagerRouter} from "./stickerManager.route";
import {configureJava} from "../config/passport.config";
import {TypeormStore} from "connect-typeorm";
import {getRepository} from "typeorm";
import {Session} from "../models/session.models";
import passport from "passport";


export function buildOrgAppRoutes() {
    const router = Router();
    configureJava();
    router.use("/", require('express-session')({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
        store: new TypeormStore({
            cleanupLimit: 2,
            limitSubquery: false,
            ttl: 259200
        }).connect(getRepository(Session)),
    }));
    router.use(passport.initialize());
    router.use(passport.session());
    router.use("/auth", authRouter);
    router.use("/project", projectManagerRouter);
    router.use("/project", columnManagerRouter);
    router.use("/project", taskManagerRouter);
    router.use("/project", checklistManagerRouter);
    router.use("/project", optionManagerRouter);
    router.use("/project", stickerManagerRouter);

    return router;
}



