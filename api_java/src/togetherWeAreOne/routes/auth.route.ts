import express from "express";
import {ensureLoggedIn, ensureLoggedOut} from "../middlewares/auth.middleware";
import passport from "passport";
import {AuthController} from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/signin", ensureLoggedOut, async function (req, res) {
    const authController = await AuthController.getInstance();
    console.log(req.body);
    try {
        const user = await authController.subscribe({...req.body, certified : false});
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        res.status(409).send(err).end();
    }
});

authRouter.post('/login', ensureLoggedOut, passport.authenticate('local-web'), async function (req, res) {
    res.status(201).json(req.user);
});

authRouter.delete('/logout', ensureLoggedIn, async function (req, res) {
    req.logout();
    res.status(204).end();
});

authRouter.get('/test', ensureLoggedOut, async function (req, res) {
    res.send('<h1>TEST MARCHE</h1>');
});


export {
    authRouter
}
