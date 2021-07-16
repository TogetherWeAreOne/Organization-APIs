import passport from "passport";

import {User as AngularUser} from "../models/user.models";
import {getRepository} from "typeorm";
import {compare} from "bcrypt";


const LocalStrategy = require('passport-local').Strategy;

export function configureWeb() {
    passport.use('local-web', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (email: string, password: string, done) {
        getRepository(AngularUser).findOne({email: email}, {select: ["id", "email", "password"]})
            .then(async user => {
                if (user === undefined) {
                    return done(null, false);
                }
                if (!(await compare(password, user.password))) {
                    return done(null, false);
                }
                return done(null, user);
            }).catch(err => {
            return done(err, false);
        });
    }));

    passport.serializeUser((user: AngularUser, cb: any) => {
        cb(null, user.id);
    });

    passport.deserializeUser(function (id: string, cb) {
        getRepository(AngularUser).findOne(id)
            .then(user => {
                cb(null, user);
            }).catch(err => cb(err, false));
    });
}
