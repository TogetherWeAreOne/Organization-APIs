import express from "express";
import {ensureLoggedIn, ensureLoggedOut} from "../middlewares/auth.middleware";
import passport from "passport";
import {AuthController} from "../controllers/auth.controller";
import {UserManagerController} from "../controllers/userManager.controller";
import {ProductManagerController} from "../controllers/productManager.controller";
import {productManagerRouter} from "./productManager.route";

const userManagerRouter = express.Router();

userManagerRouter.delete('/logout', ensureLoggedIn, async function (req, res) {
    req.logout();
    res.status(204).end();
});

userManagerRouter.get('/:userId/getUser', async function (req, res) {
    const userController = await UserManagerController.getInstance();
    const userId = req.params.userId;
    try {
        const user = await userController.getUserById(userId);
        res.status(201).json(user);
    } catch (err) {
        res.status(409).send(err).end();
    }
});

userManagerRouter.get("/getAll", ensureLoggedIn, async function (req, res){
    const userController = await UserManagerController.getInstance();
    try {
        const users = await userController.getAllUser();
        res.status(201).json( users );
    } catch ( err ){
        res.status(400).send( err );
    }
});

userManagerRouter.delete("/:userId/delete", ensureLoggedIn, async function(req, res){
    const userId = req.params.userId;
    const userController = await UserManagerController.getInstance();
    if ( userId === undefined ) {
        res.status(400).json("L'identifiant de l'utilisateur n'a pas été renseigné !").end();
        return;
    }
    try {
        await userController.deleteUserById( userId );
        res.status(201).json( "L'utilisateur "+ userId + " a bien été supprimé !" );
    } catch (err){
        res.status(400).send(err);
    }
});


export {
    userManagerRouter
}
