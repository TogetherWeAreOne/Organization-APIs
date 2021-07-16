import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {EventManagerController} from "../controllers/eventManager.controller";
import {User} from "../models/user.models";
import {EventParticipant} from "../models/eventParticipant.models";
import {EventParticipantManagerController} from "../controllers/eventParticipantManager.controller";


const eventManagerRouter = express.Router();

eventManagerRouter.post("/create", ensureLoggedIn, async function (req, res){
    const eventManagerController = await EventManagerController.getInstance();
    const eventParticipantManagerController = await EventParticipantManagerController.getInstance();
    try {
        const event = await  eventManagerController.createEvent({...req.body, creator : (req.user as User)});
        const eventParticipant = await eventParticipantManagerController.addUserToEvent({ user: (req.user as User), event: event, role:"CREATOR"});
        res.status(201).json( event && eventParticipant );
    } catch (err){
        res.status(400).send(err);
    }
});

eventManagerRouter.get("/:eventId/get", ensureLoggedIn, async function (req, res){
    const eventId = req.params.eventId;
    const eventManagerController = await EventManagerController.getInstance();
    if ( eventId === undefined ) {
        res.status(400).json("l'event id n'est pas renseigné !").end();
        return;
    }
    try {
        const event = await eventManagerController.getEventById( eventId );
        res.status(201).json( event );
    } catch ( err ){
        res.status(400).send( err );
    }
});

eventManagerRouter.get("/getAllEvent", ensureLoggedIn, async function (req, res){
    const eventManagerController = await EventManagerController.getInstance();
    try {
        const event = await eventManagerController.getAllEvent();
        res.status(201).json( event );
    } catch ( err ){
        res.status(400).send( err );
    }
});

eventManagerRouter.get("/getAllMyEvent", ensureLoggedIn, async function (req, res){
    const eventManagerController = await EventManagerController.getInstance();
    try {
        const event = await eventManagerController.getEventByCreator( (req.user as User));
        res.status(201).json( event );
    } catch ( err ){
        res.status(400).send( err );
    }
});

eventManagerRouter.put("/:eventId/update", ensureLoggedIn, async function (req, res){
    const eventId = req.params.eventId;
    const eventManagerController = await EventManagerController.getInstance();
    if ( eventId === undefined ) {
        res.status(400).json("l'event id n'est pas renseigné !").end();
        return;
    }
    try {
        const event = await eventManagerController.updateEvent(eventId, {...req.body});
        res.status(201).json( event );
    } catch (err){
        res.status(400).send(err);
    }
});

eventManagerRouter.delete("/:eventId/delete", ensureLoggedIn, async function(req, res){
    const eventId = req.params.eventId;
    const eventManagerController = await EventManagerController.getInstance();
    if ( eventId === undefined ) {
        res.status(400).json("l'event id n'est pas renseigné !").end();
        return;
    }
    try {
        const event = await eventManagerController.deleteEventById( eventId );
        res.status(201).json( "l'event "+ eventId + " à bien été supprimé" );
    } catch (err){
        res.status(400).send(err);
    }
});

export {
    eventManagerRouter
}
