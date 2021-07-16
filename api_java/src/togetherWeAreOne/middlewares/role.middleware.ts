import {User} from "../../apiJava/models/user.models";
import {UserManagerController} from "../controllers/userManager.controller";
import {EventManagerController} from "../controllers/eventManager.controller";
import {ProductManagerController} from "../controllers/productManager.controller";
import {AuctionSaleManagerController} from "../controllers/auctionSaleManager.controller";

export function isAdmin(req, res, next) {
    if (req.user.role !== "ROLE") {
        return res.status(401).end();
    }
    next();
}

export function isUserCertified(req, res, next) {
    if (req.user.certified !== true) {
        return res.status(401).end();
    }
    next();
}


export function isEventCreator(eventId: string) : (req, res, next) => void {
    return async function (req, res, next) {
        const userManagerController = await  UserManagerController.getInstance();
        const eventManagerController = await EventManagerController.getInstance();
        const user = await userManagerController.getUserById(req.user.id);
        const event = await eventManagerController.getEventById(eventId);
        if (event.creator !== user){
            return res.status(401).json("Vous n'etes pas le propriétaire de l'event").end();
        }
        next();
    }
}

export function isNotEventCreator(eventId: string) : (req, res, next) => void {
    return async function (req, res, next) {
        const userManagerController = await  UserManagerController.getInstance();
        const eventManagerController = await EventManagerController.getInstance();
        const user = await userManagerController.getUserById(req.user.id);
        const event = await eventManagerController.getEventById(eventId);
        if (event.creator === user){
            return res.status(401).json("Vous etes le propriétaire de l'event").end();
        }
        next();
    }
}

export function isProductCreator(productId: string) : (req, res, next) => void {
    return async function (req, res, next) {
        const userManagerController = await  UserManagerController.getInstance();
        const productManagerController = await ProductManagerController.getInstance();
        const user = await userManagerController.getUserById(req.user.id);
        const product = await productManagerController.getProductById(productId);
        if ( product.creator !== user){
            return res.status(401).json("Vous etes pas le propriétaire du produit").end();
        }
        next();
    }
}

export function isNotProductCreator(productId: string) : (req, res, next) => void {
    return async function (req, res, next) {
        const userManagerController = await  UserManagerController.getInstance();
        const productManagerController = await ProductManagerController.getInstance();
        const user = await userManagerController.getUserById(req.user.id);
        const product = await productManagerController.getProductById(productId);
        if ( product.creator === user){
            return res.status(401).json("Vous etes le propriétaire du produit").end();
        }
        next();
    }
}

export function isAuctionSaleCreator(auctionSaleId: string) : (req, res, next) => void {
    return async function (req, res, next) {
        const userManagerController = await  UserManagerController.getInstance();
        const auctionSaleManagerController = await AuctionSaleManagerController.getInstance();
        const user = await userManagerController.getUserById(req.user.id);
        const auctionSale = await auctionSaleManagerController.getAuctionSalesById(auctionSaleId);
        if ( auctionSale.creator !== user){
            return res.status(401).json("Vous n'etes pas le propriétaire de la vente aux enchères").end();
        }
        next();
    }
}

export function isNotAuctionSaleCreator(auctionSaleId: string) : (req, res, next) => void {
    return async function (req, res, next) {
        const userManagerController = await  UserManagerController.getInstance();
        const auctionSaleManagerController = await AuctionSaleManagerController.getInstance();
        const user = await userManagerController.getUserById(req.user.id);
        const auctionSale = await auctionSaleManagerController.getAuctionSalesById(auctionSaleId);
        if ( auctionSale.creator === user){
            return res.status(401).json("Vous etes le propriétaire de la vente aux enchères").end();
        }
        next();
    }
}


