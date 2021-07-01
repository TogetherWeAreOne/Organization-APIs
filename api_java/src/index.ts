import express, {Express} from "express";
import {createConnection, getRepository} from "typeorm";
import {config} from "dotenv";
import {configure} from "./config/passport.config";
import bodyParser from "body-parser";
import {TypeormStore} from "connect-typeorm";
import {Session} from "./models/session.models";
import passport from "passport";
import {buildRoutes} from "./routes/index.route";

config();

const port = process.env.PORT;

createConnection({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + "/**/models/*.ts"],
    synchronize: true,
    logging: true
}).then(connection => {
    configure();
    const app: Express = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(require('cookie-parser')());
    app.use("/", require('express-session')({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
        store: new TypeormStore({
            cleanupLimit: 2,
            limitSubquery: false,
            ttl: 259200
        }).connect(getRepository(Session)),
    }));
    app.use("/", passport.initialize());
    app.use("/", passport.session());
    buildRoutes(app);
    app.listen(port, function () {
        console.log(`Listening on ${port}...`);
    });

}).catch(error => console.log(error));
