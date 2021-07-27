import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {EventManagerController} from "../controllers/eventManager.controller";
import {EventParticipantManagerController} from "../controllers/eventParticipantManager.controller";
import {User} from "../models/user.models";
import {DiscussionManagerController} from "../controllers/discussionManager.controller";
import {isEventCreator} from "../middlewares/role.middleware";
import {DiscussionMessage} from "../models/discussionMessage.models";
import {DiscussionMessageManagerController} from "../controllers/discussionMessageManager.controller";
import {DiscussionProps} from "../models/discussion.models";


var moment = require('moment');
const discussionManagerRouter = express.Router();

discussionManagerRouter.post("/:discussionId/send", ensureLoggedIn,isEventCreator() , async function (req, res){
    const discussionId = req.params.discussionId;
    const discussionManagerController = await DiscussionManagerController.getInstance();
    const discussionMessageManagerController = await DiscussionMessageManagerController.getInstance();
    const discussion = await discussionManagerController.getDiscussionById( discussionId );
    if ( event === null || event === undefined || discussion === null || discussion === undefined ){
        res.status(400).send("une erreur est survenue").end();
    }
    try {
        const message = await discussionMessageManagerController.createDiscussionMessage({ content : req.body.content,
                                                                                            user :(req.user as User), discussion: discussion, date :moment().clone().format('YYYY-MM-DD HH:mm:SS') });
        console.log( discussion.id );

        const updateDiscussion = await discussionManagerController.updateDiscussion( discussion.id, {...(discussion as DiscussionProps), lastMessageDate : moment().clone().format('YYYY-MM-DD HH:mm:SS')});
        res.status(201).json( message );
    } catch (err){
        res.status(400).send(err);
    }
});

discussionManagerRouter.get("/:eventId/getDiscussion", ensureLoggedIn, async function (req, res){
    const eventId = req.params.eventId;
    const eventManagerController = await EventManagerController.getInstance();
    const discussionManagerController = await DiscussionManagerController.getInstance();
    if ( eventId === undefined ) {
        res.status(400).json("l'event id n'est pas renseigné !").end();
        return;
    }
    const event = await eventManagerController.getEventById(eventId);
    try {
        const discussion = await discussionManagerController.getDiscussionByEvent( event ) ;
        res.status(201).json( discussion );
    } catch ( err ){
        res.status(400).send( err );
    }
});

discussionManagerRouter.get("/:discussionId/getMessages", ensureLoggedIn, async function (req, res){
    const discussionId = req.params.discussionId;
    const discussionManagerController = await DiscussionManagerController.getInstance();
    const discussionMessageManagerController = await DiscussionMessageManagerController.getInstance();
    if ( discussionId === undefined ) {
        res.status(400).json("la discussion id n'est pas renseigné !").end();
        return;
    }
    const discussion = await discussionManagerController.getDiscussionById( discussionId ) ;
    try {
        const messages = await discussionMessageManagerController.getAllDiscussionMessageFromDiscussion( discussion );
        res.status(201).json( messages );
    } catch ( err ){
        res.status(400).send( err );
    }
});

discussionManagerRouter.get("/:discussionId/getEvent", ensureLoggedIn, async function (req, res){
    const discussionId = req.params.discussionId;
    const discussionManagerController = await DiscussionManagerController.getInstance();
    const eventManagerController = await EventManagerController.getInstance();
    if ( discussionId === undefined ) {
        res.status(400).json("la discussion id n'est pas renseigné !").end();
        return;
    }
    const discussion = await discussionManagerController.getDiscussionById( discussionId ) ;
    try {
        const event = await eventManagerController.getEventById( discussion.event.id );
        res.status(201).json( event );
    } catch ( err ){
        res.status(400).send( err );
    }
});



discussionManagerRouter.delete("/:discussionMessageId/deleteMessage", ensureLoggedIn, async function(req, res){
    const discussionMessageId = req.params.discussionMessageId;
    const discussionMessageManager = await DiscussionMessageManagerController.getInstance();
    if ( discussionMessageId === undefined ) {
        res.status(400).json("l'event id n'est pas renseigné !").end();
        return;
    }
    try {
        const discussionMessage = await discussionMessageManager.deleteDiscussionMessageById( discussionMessageId );
        res.status(201).json( "le message "+ discussionMessageId + " à bien été supprimé" );
    } catch (err){
        res.status(400).send(err);
    }
});

export {
    discussionManagerRouter
}
