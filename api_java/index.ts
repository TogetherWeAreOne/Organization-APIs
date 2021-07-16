import express, {Express} from "express";
import {createConnection, getRepository} from "typeorm";
import {config} from "dotenv";
import bodyParser from "body-parser";

import {buildOrgAppRoutes} from "./src/apiJava/routes/index.route";
import {buildWebRoutes} from "./src/togetherWeAreOne/routes/index.route";

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
    const app: Express = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(require('cookie-parser')());
    app.use("/organisation-app", buildOrgAppRoutes());
    app.use("/TogetherWeAreOne", buildWebRoutes());
    app.listen(port, function () {
        console.log(`Listening on ${port}...`);
    });
}).catch(error => console.log(error));
