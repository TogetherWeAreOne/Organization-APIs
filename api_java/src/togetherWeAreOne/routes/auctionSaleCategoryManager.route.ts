import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";

import {AuctionSaleCategoryManagerController} from "../controllers/auctionSaleCategoryManager.controller";

const auctionSaleCategoryManagerRouter = express.Router();

auctionSaleCategoryManagerRouter.post("/create", ensureLoggedIn, async function (req, res){
    const auctionSaleCategoryManagerController = await AuctionSaleCategoryManagerController.getInstance();
    try {
        const auctionSaleCategory = await  auctionSaleCategoryManagerController.createAuctionSaleCategory({
            ...req.body,
        });
        res.status(201).json( auctionSaleCategory );
    } catch (err){
        res.status(400).send(err);
    }
});

auctionSaleCategoryManagerRouter.get("/getAll", ensureLoggedIn, async function (req, res){
    const auctionSaleCategoryManagerController = await AuctionSaleCategoryManagerController.getInstance();
    try {
        const auctionSaleCategory = await auctionSaleCategoryManagerController.getAllAuctionSaleCategory();
        res.status(201).json( auctionSaleCategory );
    } catch ( err ){
        res.status(400).send( err );
    }
});

auctionSaleCategoryManagerRouter.get("/:auctionSaleCategoryId/get", ensureLoggedIn, async function (req, res){
    const auctionSaleCategoryId = req.params.auctionSaleCategoryId;
    const auctionSaleCategoryManagerController = await AuctionSaleCategoryManagerController.getInstance();
    if ( auctionSaleCategoryId === undefined ) {
        res.status(400).json("la catégorie vente aux enchere  id n'est pas renseigné !").end();
        return;
    }
    try {
        const auctionSaleCategory = await auctionSaleCategoryManagerController.getAuctionSaleCategoryById( auctionSaleCategoryId );
        res.status(201).json( auctionSaleCategory );
    } catch ( err ){
        res.status(400).send( err );
    }
});

auctionSaleCategoryManagerRouter.put("/:auctionSaleCategoryId/update", ensureLoggedIn, async function (req, res){
    const auctionSaleCategoryId = req.params.auctionSaleCategoryId;
    const auctionSaleCategoryManagerController = await AuctionSaleCategoryManagerController.getInstance();
    if ( auctionSaleCategoryId === undefined ) {
        res.status(400).json("la catégorie vente aux enchere  id n'est pas renseigné !").end();
        return;
    }
    try {
        const auctionSaleCategory = await auctionSaleCategoryManagerController.updateAuctionSaleCategory(auctionSaleCategoryId, {...req.body});
        res.status(201).json( auctionSaleCategory );
    } catch (err){
        res.status(400).send(err);
    }
});

auctionSaleCategoryManagerRouter.delete("/:auctionSaleCategoryId/delete", ensureLoggedIn, async function(req, res){
    const auctionSaleCategoryId = req.params.auctionSaleCategoryId;
    const auctionSaleCategoryManagerController = await AuctionSaleCategoryManagerController.getInstance();
    if ( auctionSaleCategoryId === undefined ) {
        res.status(400).json("la catégorie vente aux enchere  id n'est pas renseigné !").end();
        return;
    }
    try {
        const auctionSaleCategory = await auctionSaleCategoryManagerController.deleteAuctionSaleCategoryById( auctionSaleCategoryId );
        res.status(201).json( "la catégorie vente aux enchere "+ auctionSaleCategoryId + " à bien été supprimé" );
    } catch (err){
        res.status(400).send(err);
    }
});

export {
    auctionSaleCategoryManagerRouter
}
