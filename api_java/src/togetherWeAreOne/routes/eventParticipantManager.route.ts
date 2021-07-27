import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {EventManagerController} from "../controllers/eventManager.controller";
import {EventParticipantManagerController} from "../controllers/eventParticipantManager.controller";
import {User} from "../models/user.models";
import {UserManagerController} from "../controllers/userManager.controller";

const eventParticipantManagerRouter = express.Router();

// EVENT PARTICIPANT ACTIONS

eventParticipantManagerRouter.post("/join/:eventId", ensureLoggedIn, async function(req, res){
    const eventId = req.params.eventId;
    const eventParticipantManagerController = await EventParticipantManagerController.getInstance();
    const eventManagerController = await EventManagerController.getInstance();
    const event = await eventManagerController.getEventById( eventId );
    if ( event === undefined ) {
        res.status(400).json("l'event n'existe pas !").end();
        return;
    }
    try {
        const eventParticipant = await eventParticipantManagerController.addUserToEvent({ user: (req.user as User), event: event, role:"PARTICIPANT"});
        res.status(201).json( eventParticipant );
    } catch (err){
        res.status(400).send(err);
    }
})

eventParticipantManagerRouter.get("/:eventId/getParticipant", ensureLoggedIn, async function(req, res){
    const eventId = req.params.eventId;
    const eventParticipantManagerController = await EventParticipantManagerController.getInstance();
    const eventManagerController = await EventManagerController.getInstance();
    const event = await eventManagerController.getEventById( eventId );
    if ( event === undefined ) {
        res.status(400).json("l'event n'existe pas !").end();
        return;
    }
    try {
        const eventParticipants = await eventParticipantManagerController.getAllEventParticipantByEvent( event );
        res.status(201).json( eventParticipants );
    } catch (err){
        res.status(400).send(err);
    }
})

eventParticipantManagerRouter.get("/getMyEventParticipation", ensureLoggedIn, async function(req, res){
    const userManagerController = await UserManagerController.getInstance();
    const user = await userManagerController.getUserById( (req.user as User).id );
    const eventParticipantManagerController = await EventParticipantManagerController.getInstance();
    try {
        const eventParticipant = await eventParticipantManagerController.getAllEventParticipantByUser( user );
        console.log(eventParticipant);
        res.status(201).json( eventParticipant );
    } catch (err){
        res.status(400).send(err);
    }
})

eventParticipantManagerRouter.delete("/leave/:eventId", ensureLoggedIn, async function(req, res){
    const eventId = req.params.eventId;
    const eventParticipantManagerController = await EventParticipantManagerController.getInstance();
    const eventManagerController = await EventManagerController.getInstance();
    const event = await eventManagerController.getEventById( eventId );
    if ( event === undefined ) {
        res.status(400).json("l'event n'existe pas !").end();
        return;
    }
    try {
        const eventParticipant = await eventParticipantManagerController.leaveEvent( event, (req.user as User));
        res.status(201).json( eventParticipant );
    } catch (err){
        res.status(400).send(err);
    }
})

export {
    eventParticipantManagerRouter
}
