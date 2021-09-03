import express, {json} from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {User} from "../models/user.models";
import {ProductManagerController} from "../controllers/productManager.controller";
import {ProductCategoryManagerController} from "../controllers/productCategoryManager.controller";
import {SearchProduct} from "../models/searchProduct.models";
import {ProductPurchaseHistoryManagerController} from "../controllers/productPurchaseHistoryManager.controller";
import {callbackify} from "util";

var moment = require('moment');
const productManagerRouter = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, 'images_uploads')
    },
    filename : (req, file, callback) => {
        callback(null, `${moment().clone().format('YYYY_MM_DD_HH_mm_SS')}_product_image_${file.originalname}`)
    }
})

var upload = multer({ storage : storage});

productManagerRouter.post("/create", ensureLoggedIn, upload.array('imagesProduct'), async (req, res) => {

    const files = req.files;

    const productManagerController = await ProductManagerController.getInstance();
    const productCategoryManagerController = await ProductCategoryManagerController.getInstance();
    const productCategory = await productCategoryManagerController.getProductCategoryByName(JSON.parse(req.body.product).category);
    try {
        const product = await  productManagerController.createProduct({
            ...JSON.parse(req.body.product),
            creator : (req.user as User),
            category : productCategory,
            sended: false,
            selled: false
        });

        if( files ){
            for (let i = 0 ; i < files.length ; i++){
                const productImage = await productManagerController.saveImage({product : product, url : files[i].filename});
                console.log(files[i].filename);
            }
        }

        res.status(201).json( product && files );
    } catch (err){
        res.status(400).send(err);
    }
});

productManagerRouter.get("/:productId/getImages", ensureLoggedIn, async function (req, res){
    const productId = req.params.productId;
    const productManagerController = await ProductManagerController.getInstance();
    if ( productId === undefined ) {
        res.status(400).json("le product id n'est pas renseigné !").end();
        return;
    }
    try {
        const product = await productManagerController.getProductById(productId)
        const productImages = await productManagerController.getImageByProduct( product );
        res.status(201).json( productImages );
    } catch ( err ){
        res.status(400).send( err );
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

productManagerRouter.get("/:productId/buy", ensureLoggedIn, async function (req, res){
    const productId = req.params.productId;
    const productPurchaseHistoryManagerController = await ProductPurchaseHistoryManagerController.getInstance();
    const productManagerController = await ProductManagerController.getInstance();
    let product = await productManagerController.getProductById(productId);
    if ( productId === undefined ) {
        res.status(400).json("le product id n'est pas renseigné !").end();
        return;
    }
    try {
        product.quantity = product.quantity -1 ;
        if( product.quantity == 0  ) {
            product.state = 'SOLD';
            product.selled = true;
        }
        const product_bis = await productManagerController.updateProduct(productId, product);
        const purchaseHistory = await productPurchaseHistoryManagerController.saveProductPurchase({
            user : req.user as User,
            product : product,
            price : product.price,
            date : moment().clone().format('YYYY-MM-DD HH:mm:SS') })
        res.status(201).json( product_bis );
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
