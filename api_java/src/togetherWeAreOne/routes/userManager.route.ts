import express from "express";
import {ensureLoggedIn, ensureLoggedOut} from "../middlewares/auth.middleware";
import passport from "passport";
import {AuthController} from "../controllers/auth.controller";
import {UserManagerController} from "../controllers/userManager.controller";

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

userManagerRouter.get('/searchUser/:pseudo', async function (req, res) {
    const userController = await UserManagerController.getInstance();
    const pseudo = req.params.pseudo;
    try {
        const user = await userController.searchUser(pseudo);
        res.status(201).json(user);
    } catch (err) {
        res.status(409).send(err).end();
    }
});


export {
    userManagerRouter
}
