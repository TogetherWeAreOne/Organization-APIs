import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {ProductManagerController} from "../controllers/productManager.controller";
import {User} from "../models/user.models";
import {AuctionSaleManagerController} from "../controllers/auctionSaleManager.controller";
import {AuctionSaleCategoryManagerController} from "../controllers/auctionSaleCategoryManager.controller";
import {AuctionSaleProposalManagerController} from "../controllers/auctionSaleProposalManager.controller";
import {auctionSaleProposalManagerRouter} from "./auctionSaleProposalManager.route";
import {UserManagerController} from "../controllers/userManager.controller";
import {AuctionSaleWinHistoryManagerController} from "../controllers/auctionSaleWinHistoryManager.controller";
import {productManagerRouter} from "./productManager.route";

const auctionSaleManagerRouter = express.Router();
var moment = require('moment');
const multer = require('multer');

const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, 'images_uploads')
    },
    filename : (req, file, callback) => {
        callback(null, `${moment().clone().format('YYYY_MM_DD_HH_mm_SS')}_auction_image_${file.originalname}`)
    }
})

var upload = multer({ storage : storage});

auctionSaleManagerRouter.post("/create", ensureLoggedIn, upload.array('imagesAuction'), async function (req, res){

    const files = req.files;
    console.log(req.body);
    const auctionSaleManagerController = await AuctionSaleManagerController.getInstance();
    const auctionSaleCategoryManagerController = await AuctionSaleCategoryManagerController.getInstance();
    const auctionSaleCategory = await auctionSaleCategoryManagerController.getAuctionSaleCategoryByName(JSON.parse(req.body.auctionSale).category)
    try {
        const auctionSale = await  auctionSaleManagerController.createAuctionSales({
            ...JSON.parse(req.body.auctionSale),
            creator : (req.user as User),
            category: auctionSaleCategory,
            actualPrice : JSON.parse(req.body.auctionSale).startPrice,
            state: "ONGOING",
            selled : false,
            sended : false,
            owner : null
        });

        if( files ){
            for (let i = 0 ; i < files.length ; i++){
                const auctionImage = await auctionSaleManagerController.saveImage({auctionSale : auctionSale, url : files[i].filename});
                console.log(files[i].filename);
            }
        }

        res.status(201).json( auctionSale );
    } catch (err){
        res.status(400).send(err);
    }
});

auctionSaleManagerRouter.get("/:auctionId/getImages", ensureLoggedIn, async function (req, res){
    const auctionId = req.params.auctionId;
    const auctionSaleManagerController = await AuctionSaleManagerController.getInstance();
    if ( auctionId === undefined ) {
        res.status(400).json("le product id n'est pas renseigné !").end();
        return;
    }
    try {
        console.log("////////////////////");
        const auction = await auctionSaleManagerController.getAuctionSalesById(auctionId)
        console.log("******************");
        console.log(auction);
        const auctionImages = await auctionSaleManagerController.getImageByAuction( auction );
        console.log("-----------------------");
        console.log(auctionImages)
        res.status(201).json( auctionImages );
    } catch ( err ){
        console.log(err);
        res.status(400).send( err );
    }
});

auctionSaleManagerRouter.get("/:auctionSaleId/get", ensureLoggedIn, async function (req, res){
    const auctionSaleId = req.params.auctionSaleId;
    const auctionSaleManagerController = await AuctionSaleManagerController.getInstance();
    if ( auctionSaleId === undefined ) {
        res.status(400).json("la vente aux enchères n'existe pas !").end();
        return;
    }
    try {
        const auctionSale = await auctionSaleManagerController.getAuctionSalesById( auctionSaleId );
        res.status(201).json( auctionSale );
    } catch ( err ){
        res.status(400).send( err );
    }
});

auctionSaleManagerRouter.get("/getAll", ensureLoggedIn, async function (req, res){
    const auctionSaleManagerController = await AuctionSaleManagerController.getInstance();
    try {
        const auctionSales = await auctionSaleManagerController.getAllAuctionSales( );
        res.status(201).json( auctionSales );
    } catch ( err ){
        res.status(400).send( err );
    }
});

auctionSaleManagerRouter.get("/getAllMyAuctionSales", ensureLoggedIn, async function (req, res){
    const auctionSaleManagerController = await AuctionSaleManagerController.getInstance();
    try {
        const auctionSales = await auctionSaleManagerController.getAllAuctionSalesByUser( (req.user as User) );
        res.status(201).json( auctionSales );
    } catch ( err ){
        res.status(400).send( err );
    }
});

// UPDATE pas utile ?
auctionSaleManagerRouter.put("/:auctionSaleId/update", ensureLoggedIn, async function (req, res){
    const auctionSaleId = req.params.auctionSaleId;
    const auctionSaleManagerController = await AuctionSaleManagerController.getInstance();
    const auctionSaleCategoryManagerController = await AuctionSaleCategoryManagerController.getInstance();
    const category = await auctionSaleCategoryManagerController.getAuctionSaleCategoryByName(req.body.category);
    if ( auctionSaleId === undefined ) {
        res.status(400).json("la vente aux enchères n'existe pas !").end();
        return;
    }
    try {
        const auctionSale = await auctionSaleManagerController.updateAuctionSales(auctionSaleId, {...req.body, category : category});
        res.status(201).json( auctionSale );
    } catch (err){
        res.status(400).send(err);
    }
});

auctionSaleManagerRouter.put("/:auctionSaleId/confirm", ensureLoggedIn, async function (req, res){
    const auctionSaleId = req.params.auctionSaleId;
    const auctionSaleProposalManagerController = await AuctionSaleProposalManagerController.getInstance();
    const auctionSaleManagerController = await AuctionSaleManagerController.getInstance();
    const auctionSaleWinHistoryManagerController = await AuctionSaleWinHistoryManagerController.getInstance();
    const userManagerController = await UserManagerController.getInstance();
    const auctionSale = await auctionSaleManagerController.getAuctionSalesById( auctionSaleId );
    if ( auctionSale === undefined ) {
        res.status(400).json("la vente aux encheres n'existe pas !").end();
        return;
    }
    try {
        const user = await userManagerController.getUserById(auctionSale.owner.id);
        const auctionSaleProposal = await auctionSaleProposalManagerController.getAuctionSalesProposalByUserAndByAuctionSale(user, auctionSale);
        const auctionSaleProposalUpdate = await auctionSaleProposalManagerController.updateAuctionSaleProposal({
            ...auctionSaleProposal,
            state: "ACCEPTED"
        });
        const auctionSaleUpdate = await auctionSaleManagerController.updateAuctionSales(auctionSale.id, {
            ...auctionSale,
            selled: true,
            state: "FINISHED"
        });
        const auctionSaleWinHistory = await auctionSaleWinHistoryManagerController.saveAuctionSaleWin({
            user : auctionSaleProposal.user,
            auctionSale : auctionSale,
            price : auctionSale.actualPrice,
            date : new Date().toDateString()
        });
        res.status(201).json(auctionSale);
    } catch ( err ){
        res.status(400).send( err );
    }
});


auctionSaleManagerRouter.delete("/:auctionSaleId/delete", ensureLoggedIn, async function(req, res){
    const auctionSaleId = req.params.auctionSaleId;
    const auctionSaleManagerController = await AuctionSaleManagerController.getInstance();
    if ( auctionSaleId === undefined ) {
        res.status(400).json("la vente aux enchères n'existe pas !").end();
        return;
    }
    try {
        const auctionSale = await auctionSaleManagerController.deleteAuctionSalesById( auctionSaleId );
        res.status(201).json( "la vente aux enchères "+ auctionSaleId + " à bien été supprimé" );
    } catch (err){
        res.status(400).send(err);
    }
});

export {
    auctionSaleManagerRouter
}
