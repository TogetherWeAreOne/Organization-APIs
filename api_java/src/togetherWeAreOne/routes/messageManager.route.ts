import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {ProductManagerController} from "../controllers/productManager.controller";
import {User, UserProps} from "../models/user.models";
import {MessageManagerController} from "../controllers/messageManager.controller";
import {UserManagerController} from "../controllers/userManager.controller";
import {DiscussionUserParticipant} from "../models/discussionUserParticpant.models";
import {DiscussionUser} from "../models/discussionUser.models";

var moment = require('moment');
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
        const senderDiscussion = await messageManagerController.getDiscussionParticipantByUser((req.user as User));
        let discussionExist = await isDiscussionAlreadyExist(senderDiscussion, receiver);
        if (discussionExist === undefined){
            discussionExist = await messageManagerController.createDiscussion({ lastMessageDate : moment().clone().format('YYYY-MM-DD HH:mm:SS')});
            const addSender = await messageManagerController.createDiscussionParticipant({
                user : (req.user as User),
                discussion : discussionExist
            })
            const addReceiver = await messageManagerController.createDiscussionParticipant({
                user : receiver,
                discussion : discussionExist
            })
        }
        console.log(moment().clone().format('YYYY-MM-DD HH:mm:SS'))
        const message = await messageManagerController.createMessage({
            content : req.body.content,
            readed : false,
            sender : (req.user as User),
            receiver : receiver,
            discussion : discussionExist,
            sendedDate : new Date()
        })
        discussionExist.lastMessageDate = new Date();
        const updatedDiscussion = await messageManagerController.updateDiscussion(discussionExist.id , discussionExist)
        res.status(200).send(message);

    } catch (err){
        res.status(400).send(err);
    }
});

async function isDiscussionAlreadyExist(discussions : DiscussionUserParticipant[], receiver : User) : Promise<DiscussionUser> {
    const messageManagerController = await MessageManagerController.getInstance();
    for (let i = 0 ; i < discussions.length ; i++){
        const discussionParticipants = await  messageManagerController.getDiscussionParticipantByDiscussion(discussions[i].discussion);
        for ( let j = 0 ; j < discussionParticipants.length; j ++){
            console.log("///////");
            console.log(discussionParticipants[j].user);
            console.log("**************");
            console.log(receiver);
            console.log(discussionParticipants[j].user.id === receiver.id);
            if ( discussionParticipants[j].user.id === receiver.id){
                console.log("j'ai trouver !!! ");
                return discussionParticipants[j].discussion
            }
        }
    }
    console.log("j'ai rien trouvé !!");
    return undefined;
}

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

messageManagerRouter.get("/:discussionId/getAllMessage", ensureLoggedIn, async function (req, res){
    const discussionId = req.params.discussionId;
    const messageManagerController = await MessageManagerController.getInstance();
    const discussion = await messageManagerController.getDiscussiontById( discussionId ) ;
    try {
        const message = await messageManagerController.getAllMessageByDiscussion( discussion ) ;
        res.status(201).json( message );
    } catch ( err ){
        res.status(400).send( err );
    }
});

messageManagerRouter.get("/:discussionId/getInterlocutor", ensureLoggedIn, async function (req, res){
    const discussionId = req.params.discussionId;
    const messageManagerController = await MessageManagerController.getInstance();
    const discussion = await messageManagerController.getDiscussiontById( discussionId ) ;
    try {
        const message = await messageManagerController.getInterlocutorByDiscussion( discussion, (req.user as User) ) ;
        res.status(201).json( message );
    } catch ( err ){
        res.status(400).send( err );
    }
});

messageManagerRouter.get("/getAllMyDiscussion", ensureLoggedIn, async function (req, res){
    const messageManagerController = await MessageManagerController.getInstance();
    try {
        const discussion = await messageManagerController.getDiscussionParticipantByUser( (req.user as User)) ;
        res.status(201).json( discussion );
    } catch ( err ){
        res.status(400).send( err );
    }
});

messageManagerRouter.get("/:discussionId/getDiscussion", ensureLoggedIn, async function (req, res){
    const discussionId = req.params.discussionId;
    const messageManagerController = await MessageManagerController.getInstance();
    try {
        const discussion = await messageManagerController.getDiscussiontById( discussionId ) ;
        res.status(201).json( discussion );
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
