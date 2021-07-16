import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {User} from "../models/user.models";
import {ProductManagerController} from "../controllers/productManager.controller";
import {ProductCategoryManagerController} from "../controllers/productCategoryManager.controller";
import {SearchProduct} from "../models/searchProduct.models";

const productManagerRouter = express.Router();

productManagerRouter.post("/create", ensureLoggedIn, async function (req, res){
    const productManagerController = await ProductManagerController.getInstance();
    const productCategoryManagerController = await ProductCategoryManagerController.getInstance();
    const productCategory = await productCategoryManagerController.getProductCategoryByName(req.body.category);
    try {
        const product = await  productManagerController.createProduct({
            ...req.body,
            creator : (req.user as User),
            category : productCategory,
            sended: false,
            selled: false
        });
        res.status(201).json( product );
    } catch (err){
        res.status(400).send(err);
    }
});

productManagerRouter.get("/:productId/get", ensureLoggedIn, async function (req, res){
    const productId = req.params.productId;
    const productManagerController = await ProductManagerController.getInstance();
    if ( productId === undefined ) {
        res.status(400).json("le product id n'est pas renseigné !").end();
        return;
    }
    try {
        const product = await productManagerController.getProductById( productId );
        res.status(201).json( product );
    } catch ( err ){
        res.status(400).send( err );
    }
});

productManagerRouter.get("/getAll", ensureLoggedIn, async function (req, res){
    const productManagerController = await ProductManagerController.getInstance();
    try {
        const product = await productManagerController.getAllProduct();
        res.status(201).json( product );
    } catch ( err ){
        res.status(400).send( err );
    }
});

productManagerRouter.post("/getBySearch", ensureLoggedIn, async function (req, res){
    const productManagerController = await ProductManagerController.getInstance();
    console.log( (req.body as SearchProduct));
    console.log("//////:::::::::::::::::");
    console.log( (req.body as SearchProduct).maxPrice);

        const product = await productManagerController.getProductBySearch({...req.body });
        res.status(201).json( product );

});

productManagerRouter.get("/getAllMyProduct", ensureLoggedIn, async function (req, res){
    const productManagerController = await ProductManagerController.getInstance();
    try {
        const product = await productManagerController.getProductByCreator( (req.user as User) );
        res.status(201).json( product );
    } catch ( err ){
        res.status(400).send( err );
    }
});

productManagerRouter.put("/:productId/update", ensureLoggedIn, async function (req, res){
    const productId = req.params.productId;
    const productManagerController = await ProductManagerController.getInstance();
    if ( productId === undefined ) {
        res.status(400).json("le product id n'est pas renseigné !").end();
        return;
    }
    try {
        const product = await productManagerController.updateProduct(productId, {...req.body});
        res.status(201).json( product );
    } catch (err){
        res.status(400).send(err);
    }
});

productManagerRouter.delete("/:productId/delete", ensureLoggedIn, async function(req, res){
    const productId = req.params.productId;
    const productManagerController = await ProductManagerController.getInstance();
    if ( productId === undefined ) {
        res.status(400).json("le product id n'est pas renseigné !").end();
        return;
    }
    try {
        const product = await productManagerController.deleteProductById( productId );
        res.status(201).json( "le produit "+ productId + " à bien été supprimé" );
    } catch (err){
        res.status(400).send(err);
    }
});

export {
    productManagerRouter
}
