import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {ProductCategoryManagerController} from "../controllers/productCategoryManager.controller";

const productCategoryManagerRouter = express.Router();

productCategoryManagerRouter.post("/create", ensureLoggedIn, async function (req, res){
    const productCategoryManagerController = await ProductCategoryManagerController.getInstance();
    try {
        const productCategory = await  productCategoryManagerController.createProductCategory({
            ...req.body,
        });
        res.status(201).json( productCategory );
    } catch (err){
        res.status(400).send(err);
    }
});

productCategoryManagerRouter.get("/getAll", ensureLoggedIn, async function (req, res){
    const productCategoryManagerController = await ProductCategoryManagerController.getInstance();
    try {
        const productCategory = await productCategoryManagerController.getAllProductCategory( );
        res.status(201).json( productCategory );
    } catch ( err ){
        res.status(400).send( err );
    }
});

productCategoryManagerRouter.get("/:productCategoryId/get", ensureLoggedIn, async function (req, res){
    const productCategoryId = req.params.productCategoryId;
    const productCategoryManagerController = await ProductCategoryManagerController.getInstance();
    if ( productCategoryId === undefined ) {
        res.status(400).json("le product category id n'est pas renseigné !").end();
        return;
    }
    try {
        const productCategory = await productCategoryManagerController.getProductCategoryById( productCategoryId );
        res.status(201).json( productCategory );
    } catch ( err ){
        res.status(400).send( err );
    }
});

productCategoryManagerRouter.get("/:productCategoryName/getByName", ensureLoggedIn, async function (req, res){
    const productCategoryName = req.params.productCategoryName;
    const productCategoryManagerController = await ProductCategoryManagerController.getInstance();
    if ( productCategoryName === undefined ) {
        res.status(400).json("le product category id n'est pas renseigné !").end();
        return;
    }
    try {
        const productCategory = await productCategoryManagerController.getProductCategoryByName( productCategoryName );
        res.status(201).json( productCategory );
    } catch ( err ){
        res.status(400).send( err );
    }
});

productCategoryManagerRouter.put("/:productCategoryId/update", ensureLoggedIn, async function (req, res){
    const productCategoryId = req.params.productCategoryId;
    const productCategoryManagerController = await ProductCategoryManagerController.getInstance();
    if ( productCategoryId === undefined ) {
        res.status(400).json("le product id n'est pas renseigné !").end();
        return;
    }
    try {
        const productCategory = await productCategoryManagerController.updateProductCategory(productCategoryId, {...req.body});
        res.status(201).json( productCategory );
    } catch (err){
        res.status(400).send(err);
    }
});

productCategoryManagerRouter.delete("/:productCategoryId/delete", ensureLoggedIn, async function(req, res){
    const productCategoryId = req.params.productCategoryId;
    const productCategoryManagerController = await ProductCategoryManagerController.getInstance();
    if ( productCategoryId === undefined ) {
        res.status(400).json("le product id n'est pas renseigné !").end();
        return;
    }
    try {
        const productCategory = await productCategoryManagerController.deleteProductCategoryById( productCategoryId );
        res.status(201).json( "le produit "+ productCategoryId + " à bien été supprimé" );
    } catch (err){
        res.status(400).send(err);
    }
});

export {
    productCategoryManagerRouter
}
