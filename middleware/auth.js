const express = require("express");
const app = express();
const router = express.Router();
var cookieParser = require('cookie-parser');
router.use(cookieParser());
const path = require('path');
const userlogincontroller = require("../controllers/userlogincontroller");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const Register = require("../models/register");

exports.auth = async (req, res, next) => {
    try {
        const tokenn = req.cookies.node1;
        if (tokenn) {
            const verifytokenn = jwt.verify(tokenn, "FULLSTACKWEBMEANMERN", async (err, decodedToken) => {
                if (err) {
                    console.log(err, message);
                    res.redirect('logins')
                } else {
                    //console.log(decodedToken)
                    req.user = await Register.findOne({ _id: decodedToken.id });
                    // Inject the current user data into the view.
                    //console.log("user email is: " + req.user.email);
                    res.locals.currentUser = req.user;
                    //req.currentUser = user;
                    req.myuser = decodedToken.id;
                    next();
                }
            });

        }
        else {
            res.locals.currentUser = null;
            res.redirect('logins')
        }

    } catch (error) {
        res.status(401).send(error);
    }
}


exports.isAdmin = async (req, res, next) => {
    try{
        if (req.user.role != "afzal712") {
            console.log("in admin");
            return next(res.send("Access Denied, you must b admin", 401))
        }
        next()
    }catch (error) {
        res.status(401).send(error);
    }
}

exports.isUser = async (req, res, next) => {
    try{
        if (req.user.role == "afzal712") {
            console.log("in user");
            return next(res.send("Access Denied, you must b user", 401))
        }
        next()
    }catch (error) {
        res.status(401).send(error);
    }
}
