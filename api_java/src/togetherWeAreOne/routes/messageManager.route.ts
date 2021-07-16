import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {ProductManagerController} from "../controllers/productManager.controller";
import {User} from "../models/user.models";
import {MessageManagerController} from "../controllers/messageManager.controller";
import {UserManagerController} from "../controllers/userManager.controller";

const messageManagerRouter = express.Router();

messageManagerRouter.post("/send/:receiverId", ensureLoggedIn, async function (req, res){
    const receiverId = req.params.receiverId;
    const messageManagerController = await MessageManagerController.getInstance();
    const userManagerController = await UserManagerController.getInstance();
    const receiver = await userManagerController.getUserById(receiverId);
    if ( receiver === undefined){
        res.status(400).json("le destinataire n'existe pas !").end();
        return;
    }
    try {
        const message = await  messageManagerController.createMessage({...req.body, sender : (req.user as User), receiver : receiver});
        res.status(201).json( message );
    } catch (err){
        res.status(400).send(err);
    }
});

messageManagerRouter.get("/:messageId/get", ensureLoggedIn, async function (req, res){
    const messageId = req.params.messageId;
    const messageManagerController = await MessageManagerController.getInstance();
    if ( messageId === undefined ) {
        res.status(400).json("le message id n'est pas renseigné !").end();
        return;
    }
    try {
        const message = await messageManagerController.getMessageById( messageId );
        res.status(201).json( message );
    } catch ( err ){
        res.status(400).send( err );
    }
});

messageManagerRouter.get("/getAllMyMessage", ensureLoggedIn, async function (req, res){
    const messageManagerController = await MessageManagerController.getInstance();
    try {
        const message = await messageManagerController.getAllMessageByUser( (req.user as User)) ;
        res.status(201).json( message );
    } catch ( err ){
        res.status(400).send( err );
    }
});

messageManagerRouter.put("/:messageId/update", ensureLoggedIn, async function (req, res){
    const messageId = req.params.messageId;
    const messageManagerController = await MessageManagerController.getInstance();
    if ( messageId === undefined ) {
        res.status(400).json("le message id n'est pas renseigné !").end();
        return;
    }
    try {
        const message = await messageManagerController.updateMessage(messageId, {...req.body});
        res.status(201).json( message );
    } catch (err){
        res.status(400).send(err);
    }
});

messageManagerRouter.delete("/:messageId/delete", ensureLoggedIn, async function(req, res){
    const messageId = req.params.messageId;
    const messageManagerController = await MessageManagerController.getInstance();
    if ( messageId === undefined ) {
        res.status(400).json("le message id n'est pas renseigné !").end();
        return;
    }
    try {
        const message = await messageManagerController.deleteMessageById( messageId );
        res.status(201).json( "le message "+ messageId + " à bien été supprimé" );
    } catch (err){
        res.status(400).send(err);
    }
});

export {
    messageManagerRouter
}
