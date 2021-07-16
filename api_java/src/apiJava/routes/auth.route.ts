import express from "express";
import {ensureLoggedIn, ensureLoggedOut} from "../middlewares/auth.middleware";
import passport from "passport";
import {AuthController} from "../controllers/auth.controller";


const authRouter = express.Router();


authRouter.post("/signup", ensureLoggedOut, async function (req, res) {
    const authController = await AuthController.getInstance();
    try {
        const user = await authController.subscribe({...req.body});
        res.status(201).json(user);
    } catch (err) {
        res.status(409).send(err).end();
    }
});

authRouter.post('/login', ensureLoggedOut, passport.authenticate('local-java'), async function (req, res) {
    res.status(201).json(req.user);
});

authRouter.delete('/logout', ensureLoggedIn, async function (req, res) {
    req.logout();
    res.status(204).end();
});


export {
    authRouter
}
