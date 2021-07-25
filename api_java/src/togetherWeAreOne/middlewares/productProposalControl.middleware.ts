import {UserManagerController} from "../controllers/userManager.controller";
import {ProductManagerController} from "../controllers/productManager.controller";
import {ProductProposalManagerController} from "../controllers/productProposalManager.controller";

export function isProductProposalAlreadyExist() : (req, res, next) => void {
    return async function (req, res, next) {
        const userManagerController = await  UserManagerController.getInstance();
        const productManagerController = await ProductManagerController.getInstance();
        const productProposalManagerController = await ProductProposalManagerController.getInstance();
        const user = await userManagerController.getUserById(req.user.id);
        const product = await productManagerController.getProductById(req.params.productId);
        const auctionSaleProposal = await productProposalManagerController.getProductProposalByUserAndByProduct( user, product);
        if ( auctionSaleProposal !== undefined && auctionSaleProposal.state !== "PENDING"){
            return res.status(401).json("Vous avez deja fais une proposition d'achat produit et elle est toujours en attente").end();
        }
        next();
    }
}
