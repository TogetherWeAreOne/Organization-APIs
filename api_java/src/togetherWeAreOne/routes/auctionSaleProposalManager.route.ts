import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {User} from "../models/user.models";
import {AuctionSaleProposalManagerController} from "../controllers/auctionSaleProposalManager.controller";
import {AuctionSaleManagerController} from "../controllers/auctionSaleManager.controller";
import {
    isAuctionSaleProposalAlreadyExist,
    isAuctionSaleProposalSuperiorThanActualPrice
} from "../middlewares/auctionSaleProposalControl.middleware";

const auctionSaleProposalManagerRouter = express.Router();

auctionSaleProposalManagerRouter.post("/proposal/:auctionSaleId/create", ensureLoggedIn, isAuctionSaleProposalAlreadyExist(),isAuctionSaleProposalSuperiorThanActualPrice(), async function (req, res){
    const auctionSaleId = req.params.auctionSaleId;
    const auctionSaleManagerController = await AuctionSaleManagerController.getInstance();
    const auctionSaleProposalManagerController = await AuctionSaleProposalManagerController.getInstance();
    const auctionSale = await auctionSaleManagerController.getAuctionSalesById(auctionSaleId);
    console.log(auctionSale)
    if ( auctionSale === undefined){
        res.status(400).json("La vente aux enchère n'existe pas ! ").end();
        return;
    }
    try {
        if(auctionSale.owner !== null) {
            const previousProposal = await auctionSaleProposalManagerController.getAuctionSalesProposalByUserAndByAuctionSale(auctionSale.owner, auctionSale);
            const previousProposalUpdate = await auctionSaleProposalManagerController.updateAuctionSaleProposal({
                ...previousProposal,
                state: "REFUSED"
            })
        }
        const auctionSaleProposal = await auctionSaleProposalManagerController.makeAuctionSaleProposal({
            ...req.body,
            user : (req.user as User),
            auctionSale: auctionSale,
            state:"PENDING"
        });

        const auctionSaleUpdated = await auctionSaleManagerController.updateAuctionSales(auctionSale.id, {
            ...auctionSale,
            owner: (req.user as User),
            actualPrice: auctionSaleProposal.price
        })
        res.status(201).json( auctionSaleProposal );
    } catch (err){
        res.status(400).send(err);
    }
});

auctionSaleProposalManagerRouter.get("/proposal/:auctionSaleId/getMyProposal", ensureLoggedIn, async function (req, res){
    const auctionSaleId = req.params.auctionSaleId;
    const auctionSaleProposalManagerController = await AuctionSaleProposalManagerController.getInstance();
    const auctionSaleManagerController = await AuctionSaleManagerController.getInstance();
    const auctionSale = await auctionSaleManagerController.getAuctionSalesById( auctionSaleId );
    if ( auctionSale === undefined ) {
        res.status(400).json("la proposition aux encheres n'existe pas !").end();
        return;
    }
    try {
        const auctionSaleProposal = await auctionSaleProposalManagerController.getAuctionSalesProposalByUserAndByAuctionSale( (req.user as User), auctionSale  );
        res.status(201).json( auctionSaleProposal );
    } catch ( err ){
        res.status(400).send( err );
    }
});

auctionSaleProposalManagerRouter.get("/proposal/getAllMyProposal", ensureLoggedIn, async function (req, res){
    const auctionSaleProposalManagerController = await AuctionSaleProposalManagerController.getInstance();
    try {
        const auctionSaleProposal = await auctionSaleProposalManagerController.getAuctionSalesProposalByUser( (req.user as User)  );
        res.status(201).json( auctionSaleProposal );
    } catch ( err ){
        res.status(400).send( err );
    }
});

auctionSaleProposalManagerRouter.get("/proposal/:auctionSaleId/getAllProposal", ensureLoggedIn, async function (req, res){
    const auctionSaleId = req.params.auctionSaleId;
    const auctionSaleProposalManagerController = await AuctionSaleProposalManagerController.getInstance();
    const auctionSaleManagerController = await AuctionSaleManagerController.getInstance();
    const auctionSale = await auctionSaleManagerController.getAuctionSalesById( auctionSaleId );
    if ( auctionSale === undefined ) {
        res.status(400).json("la vente aux encheres n'existe pas !").end();
        return;
    }
    try {
        const auctionSaleProposals = await auctionSaleProposalManagerController.getAuctionSalesProposalByAuctionSale( auctionSale  );
        res.status(201).json( auctionSaleProposals );
    } catch ( err ){
        res.status(400).send( err );
    }
});

auctionSaleProposalManagerRouter.delete("/proposal/:auctionSaleProposalId/delete", ensureLoggedIn, async function(req, res){
    const auctionSaleProposalId = req.params.auctionSaleProposalId;
    const auctionSaleProposalManagerController = await AuctionSaleProposalManagerController.getInstance();
    if ( auctionSaleProposalId === undefined ) {
        res.status(400).json("la proposition aux encheres n'existe pas !").end();
        return;
    }
    try {
        const auctionSaleProposal = await auctionSaleProposalManagerController.deleteAuctionSalesById( auctionSaleProposalId );
        res.status(201).json( "la proposition aux encheres "+ auctionSaleProposalId + " à bien été supprimé" );
    } catch (err){
        res.status(400).send(err);
    }
});

export {
    auctionSaleProposalManagerRouter
}
