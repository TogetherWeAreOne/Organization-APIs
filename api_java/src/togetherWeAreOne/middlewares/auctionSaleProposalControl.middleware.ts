import {UserManagerController} from "../controllers/userManager.controller";
import {AuctionSaleManagerController} from "../controllers/auctionSaleManager.controller";
import {AuctionSaleProposalManagerController} from "../controllers/auctionSaleProposalManager.controller";

export function isAuctionSaleProposalAlreadyExist(auctionSaleId: string) : (req, res, next) => void {
    return async function (req, res, next) {
        const userManagerController = await  UserManagerController.getInstance();
        const auctionSaleManagerController = await AuctionSaleManagerController.getInstance();
        const auctionSaleProposalManagerController = await AuctionSaleProposalManagerController.getInstance();
        const user = await userManagerController.getUserById(req.user.id);
        const auctionSale = await auctionSaleManagerController.getAuctionSalesById(auctionSaleId);
        const auctionSaleProposal = await auctionSaleProposalManagerController.getAuctionSalesProposalByUserAndByAuctionSale( user, auctionSale);
        if ( auctionSaleProposal !== undefined && auctionSaleProposal.state !== "PENDING"){
            return res.status(401).json("Vous avez deja fais une proposition d'achat Vente enchere et elle est toujours en attente").end();
        }
        next();
    }
}

export function isNoAuctionSaleProposalExist(auctionSaleId: string) : (req, res, next) => void {
    return async function (req, res, next) {
        const auctionSaleManagerController = await AuctionSaleManagerController.getInstance();
        const auctionSaleProposalManagerController = await AuctionSaleProposalManagerController.getInstance();
        const auctionSale = await auctionSaleManagerController.getAuctionSalesById(auctionSaleId);
        const auctionSaleProposal = await auctionSaleProposalManagerController.getAuctionSalesProposalByAuctionSale( auctionSale);
        if ( auctionSaleProposal !== undefined ){
            return res.status(401).json("Vous ne pouvez pas supprimez cette ventes aux encheres car il y a deja des proposition d'achat").end();
        }
        next();
    }
}

export function isAuctionSaleProposalSuperiorThanActualPrice(auctionSaleId: string) : (req, res, next) => void {
    return async function (req, res, next) {
        const auctionSaleManagerController = await AuctionSaleManagerController.getInstance();
        const auctionSale = await auctionSaleManagerController.getAuctionSalesById(auctionSaleId);
        if ( auctionSale.actualPrice <= req.params.price){
            return res.status(401).json("Vous devez mettre un prix supérieur au prix actuel").end();
        }
        next();
    }
}
