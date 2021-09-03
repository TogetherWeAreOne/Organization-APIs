import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";

import {User} from "../models/user.models";
import {ProductManagerController} from "../controllers/productManager.controller";
import {ProductProposalManagerController} from "../controllers/productProposalManager.controller";
import {UserManagerController} from "../controllers/userManager.controller";
import {ProductPurchaseHistoryManagerController} from "../controllers/productPurchaseHistoryManager.controller";
import {isProductProposalAlreadyExist} from "../middlewares/productProposalControl.middleware";

var moment = require('moment');
const productProposalManagerRouter = express.Router();

productProposalManagerRouter.post("/proposal/:productId/create", ensureLoggedIn,isProductProposalAlreadyExist(), async function (req, res){
    const productId = req.params.productId;
    const productManagerController = await ProductManagerController.getInstance();
    const productProposalManagerController = await ProductProposalManagerController.getInstance();
    const product = await productManagerController.getProductById(productId);
    console.log(product);
    if ( product === undefined){
        res.status(400).json("Le produit n'existe pas ! ").end();
        return;
    }
    try {
        const productProposal = await productProposalManagerController.makeProductProposal({
            ...req.body,
            user : (req.user as User),
            product: product,
            state:"PENDING"
        });
        res.status(201).json( productProposal );
    } catch (err){
        res.status(400).send(err);
    }
});

productProposalManagerRouter.get("/proposal/:productId/getMyProposal", ensureLoggedIn, async function (req, res){
    const productId = req.params.productId;
    const productProposalManagerController = await ProductProposalManagerController.getInstance();
    const productManagerController = await ProductManagerController.getInstance();
    const product = await productManagerController.getProductById( productId );
    if ( product === undefined ) {
        res.status(400).json("Le produit n'existe pas !").end();
        return;
    }
    try {
        const productProposal = await productProposalManagerController.getProductProposalByUserAndByProduct( (req.user as User), product  );
        res.status(201).json( productProposal );
    } catch ( err ){
        res.status(400).send( err );
    }
});

productProposalManagerRouter.get("/proposal/getAllMyProposal", ensureLoggedIn, async function (req, res){
    const productProposalManagerController = await ProductProposalManagerController.getInstance();
    try {
        const productProposal = await productProposalManagerController.getProductProposalByUser( (req.user as User)  );
        res.status(201).json( productProposal );
    } catch ( err ){
        res.status(400).send( err );
    }
});

productProposalManagerRouter.get("/proposal/:productId/getAllProposal", ensureLoggedIn, async function (req, res){
    const productId = req.params.productId;
    const productProposalManagerController = await ProductProposalManagerController.getInstance();
    const productManagerController = await ProductManagerController.getInstance();
    const product = await productManagerController.getProductById( productId );
    if ( product === undefined ) {
        res.status(400).json("Le produit n'existe pas !").end();
        return;
    }
    try {
        const productProposals = await productProposalManagerController.getProductProposalByProduct( product  );
        res.status(201).json( productProposals );
    } catch ( err ){
        res.status(400).send( err );
    }
});

productProposalManagerRouter.put("/proposal/:productId/:userId/confirm", ensureLoggedIn, async function (req, res){
    const productId = req.params.productId;
    const userId = req.params.userId;
    const userManagerController = await UserManagerController.getInstance();
    const productProposalManagerController = await ProductProposalManagerController.getInstance();
    const productManagerController = await ProductManagerController.getInstance();
    const productPurchaseHistoryManagerController = await ProductPurchaseHistoryManagerController.getInstance();
    const product = await productManagerController.getProductById( productId );
    const user = await userManagerController.getUserById(userId);
    if ( product === undefined ) {
        res.status(400).json("Le produit n'existe pas !").end();
        return;
    }
    try {
        const productProposal = await productProposalManagerController.getProductProposalByUserAndByProduct( user, product);
        const productProposalUpdate = await productProposalManagerController.updateProductProposal({
            ...productProposal,
            state : "ACCEPTED"
        });
        product.quantity = product.quantity -1 ;
        if( product.quantity === 0  ) {
            product.state = 'SOLD';
            product.selled = true;
        }
        const productUpdate = await productManagerController.updateProduct(productId, product);
        const productPurchaseHistory = productPurchaseHistoryManagerController.saveProductPurchase({
            user : user,
            product : product,
            price : productProposal.price,
            date : moment().clone().format('YYYY-MM-DD HH:mm:SS')
        })
        res.status(201).json( productProposal );
    } catch ( err ){
        res.status(400).send( err );
    }
});

productProposalManagerRouter.put("/proposal/:productId/:userId/refused", ensureLoggedIn, async function (req, res){
    const productId = req.params.productId;
    const userId = req.params.userId;
    const userManagerController = await UserManagerController.getInstance();
    const productProposalManagerController = await ProductProposalManagerController.getInstance();
    const productManagerController = await ProductManagerController.getInstance();
    const product = await productManagerController.getProductById( productId );
    const user = await userManagerController.getUserById(userId);
    if ( product === undefined ) {
        res.status(400).json("Le produit n'existe pas !").end();
        return;
    }
    try {
        const productProposal = await productProposalManagerController.getProductProposalByUserAndByProduct( user, product);
        const productProposalUpdate = await productProposalManagerController.updateProductProposal({
            ...productProposal,
            state : "REFUSED"
        })
        res.status(201).json( productProposal );
    } catch ( err ){
        res.status(400).send( err );
    }
});


// delete utile ?

productProposalManagerRouter.delete("/proposal/:productProposalId/delete", ensureLoggedIn, async function(req, res){
    const productProposalId = req.params.productProposalId;
    const auctionSaleProposalManagerController = await ProductProposalManagerController.getInstance();
    if ( productProposalId === undefined ) {
        res.status(400).json("Le produit n'existe pas !").end();
        return;
    }
    try {
        const productProposal = await auctionSaleProposalManagerController.deleteProductProposalById( productProposalId );
        res.status(201).json( "Le produit proposal "+ productProposalId + " à bien été supprimé" );
    } catch (err){
        res.status(400).send(err);
    }
});

export {
    productProposalManagerRouter
}
