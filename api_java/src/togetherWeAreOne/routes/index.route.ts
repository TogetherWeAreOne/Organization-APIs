import {Express, Router} from "express";
import {configureWeb} from "../config/passport.config";
import {TypeormStore} from "connect-typeorm";
import {getRepository} from "typeorm";
import {Session} from "../models/session.models";
import passport from "passport";
import {authRouter} from "./auth.route";
import {eventManagerRouter} from "./eventManager.route";
import {productManagerRouter} from "./productManager.route";
import {messageManagerRouter} from "./messageManager.route";
import {auctionSaleManagerRouter} from "./auctionSaleManager.route";
import {eventParticipantManagerRouter} from "./eventParticipantManager.route";
import {auctionSaleProposalManagerRouter} from "./auctionSaleProposalManager.route";
import {productProposalManagerRouter} from "./productProposalManager.route";
import {productCategoryManagerRouter} from "./productCategoryManager.route";
import {auctionSaleCategoryManagerRouter} from "./auctionSaleCategoryManager.route";
import {request} from "https";




export function buildWebRoutes() {
    const router = Router();
    configureWeb();
    //router.use(Cors());
    router.use(require('cors')({ credentials : true, origin: "http://54.37.154.109:80"}));
    /*router.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })*/
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
    router.use("/event", eventManagerRouter);
    router.use("/event", eventParticipantManagerRouter);
    router.use("/product", productManagerRouter);
    router.use("/message", messageManagerRouter);
    router.use("/auctionSale", auctionSaleManagerRouter);
    router.use("/auctionSale", auctionSaleProposalManagerRouter);
    router.use("/product", productProposalManagerRouter);
    router.use("/productCategory", productCategoryManagerRouter);
    router.use("/auctionSaleCategory", auctionSaleCategoryManagerRouter);

    return router;
}



